"""Exploded view of a digital product, modelled in Blender and exported as a GLB.

Run headless (Blender 4.2 LTS):
    blender -b --factory-startup --python scripts/blender/exploded-device.py

Writes public/models/exploded-device.glb with one animation, "explode": the layers start
stacked and open up along the vertical axis. Materials use the brand palette; the cherry
wood is a procedural texture baked to an image so it survives the glTF export.
"""

import math
import os

import bmesh
import bpy

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
OUT = os.path.join(ROOT, "public", "models", "exploded-device.glb")
BAKE = os.path.join(os.path.dirname(OUT), "wood.png")

W, D = 2.2, 4.4  # device footprint (portrait, lying flat)
GAP = 0.5  # gap between layers when exploded
FRAMES = 72  # explode duration at 24 fps


def srgb(hex_):
    """Hex sRGB to linear RGBA, the space Blender's colour sockets use."""
    h = hex_.lstrip("#")
    out = []
    for i in (0, 2, 4):
        c = int(h[i : i + 2], 16) / 255
        out.append(c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4)
    return (*out, 1.0)


PALETTE = {
    "titanio": "#0E1114",
    "grafito": "#171B20",
    "acero": "#20262D",
    "aluminio": "#8C96A3",
    "niebla": "#E8ECF1",
    "cerezo": "#D2734E",
    "cerezo_profundo": "#8E3B22",
}


# ── Scene reset ──
bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene
scene.render.fps = 24
scene.frame_start = 1
scene.frame_end = FRAMES


# ── Materials ──
def principled(name, color, metallic=0.0, roughness=0.5, **extra):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    bsdf = m.node_tree.nodes["Principled BSDF"]
    bsdf.inputs["Base Color"].default_value = srgb(color)
    bsdf.inputs["Metallic"].default_value = metallic
    bsdf.inputs["Roughness"].default_value = roughness
    for key, value in extra.items():
        bsdf.inputs[key].default_value = value
    return m


MAT = {
    "aluminium": principled("Aluminium", "#C4CAD2", 1.0, 0.28),
    "titanium": principled("Titanium", "#2B3139", 0.85, 0.42),
    "graphite": principled("Graphite", PALETTE["grafito"], 0.2, 0.7),
    "steel": principled("Steel", PALETTE["acero"], 0.4, 0.5),
    "fog": principled("Fog", PALETTE["niebla"], 0.0, 0.6),
    "cherry": principled("Cherry", PALETTE["cerezo"], 0.1, 0.4),
    "cherry_glow": principled(
        "CherryGlow",
        PALETTE["cerezo"],
        0.0,
        0.5,
        **{"Emission Color": srgb(PALETTE["cerezo"]), "Emission Strength": 0.35},
    ),
    "screen": principled("Screen", PALETTE["titanio"], 0.3, 0.22),
    "glass": principled(
        "Glass", "#FFFFFF", 0.0, 0.04, **{"Transmission Weight": 1.0, "IOR": 1.5, "Coat Weight": 1.0}
    ),
    "lens": principled("Lens", "#05070A", 0.0, 0.05, **{"Coat Weight": 1.0}),
}


def wood_material():
    """Procedural cherry: stretched waves for the grain, noise for figure. Baked later."""
    m = bpy.data.materials.new("Cherry Wood")
    m.use_nodes = True
    nt = m.node_tree
    bsdf = nt.nodes["Principled BSDF"]
    bsdf.inputs["Roughness"].default_value = 0.55
    coord = nt.nodes.new("ShaderNodeTexCoord")
    mapping = nt.nodes.new("ShaderNodeMapping")
    mapping.inputs["Scale"].default_value = (0.12, 1.0, 1.0)  # grain runs along the device
    wave = nt.nodes.new("ShaderNodeTexWave")
    wave.wave_type = "BANDS"
    wave.bands_direction = "Y"
    wave.inputs["Scale"].default_value = 6.0
    wave.inputs["Distortion"].default_value = 7.0
    wave.inputs["Detail"].default_value = 4.0
    wave.inputs["Detail Roughness"].default_value = 0.65
    noise = nt.nodes.new("ShaderNodeTexNoise")
    noise.inputs["Scale"].default_value = 30.0
    mix = nt.nodes.new("ShaderNodeMix")
    mix.data_type = "FLOAT"
    mix.inputs["Factor"].default_value = 0.18
    ramp = nt.nodes.new("ShaderNodeValToRGB")
    ramp.color_ramp.elements[0].color = srgb("#7A3A22")
    ramp.color_ramp.elements[1].color = srgb("#B8653F")
    ramp.color_ramp.elements[0].position = 0.25
    mid = ramp.color_ramp.elements.new(0.6)
    mid.color = srgb("#A4552F")
    nt.links.new(coord.outputs["UV"], mapping.inputs["Vector"])
    nt.links.new(mapping.outputs["Vector"], wave.inputs["Vector"])
    nt.links.new(mapping.outputs["Vector"], noise.inputs["Vector"])
    nt.links.new(wave.outputs["Fac"], mix.inputs["A"])
    nt.links.new(noise.outputs["Fac"], mix.inputs["B"])
    nt.links.new(mix.outputs["Result"], ramp.inputs["Fac"])
    nt.links.new(ramp.outputs["Color"], bsdf.inputs["Base Color"])
    return m


MAT["wood"] = wood_material()


# ── Geometry helpers ──
def slab(name, w, d, h, r, mat, x=0.0, y=0.0, z=0.0, edge=0.015, parent=None):
    """Rounded slab with its bottom at z: plan corners of radius r, every edge softened."""
    me = bpy.data.meshes.new(name)
    bm = bmesh.new()
    bmesh.ops.create_cube(bm, size=1.0)
    bmesh.ops.scale(bm, vec=(w, d, h), verts=bm.verts)
    bmesh.ops.translate(bm, vec=(0, 0, h / 2), verts=bm.verts)
    vertical = [e for e in bm.edges if abs(e.verts[0].co.z - e.verts[1].co.z) > 1e-6]
    if r > 0:
        bmesh.ops.bevel(
            bm, geom=vertical, offset=min(r, w / 2 - 1e-3, d / 2 - 1e-3), segments=12, affect="EDGES", profile=0.5
        )
    bm.to_mesh(me)
    bm.free()
    ob = bpy.data.objects.new(name, me)
    bpy.context.collection.objects.link(ob)
    ob.location = (x, y, z)
    ob.data.materials.append(mat)
    if edge > 0:
        mod = ob.modifiers.new("edge", "BEVEL")
        mod.width = min(edge, h / 3)
        mod.segments = 3
        mod.limit_method = "ANGLE"
        mod.angle_limit = math.radians(60)
        mod.harden_normals = True
    for p in ob.data.polygons:
        p.use_smooth = True
    if parent:
        ob.parent = parent
    return ob


def cylinder(name, radius, h, mat, x=0.0, y=0.0, z=0.0, parent=None, verts=48):
    bpy.ops.mesh.primitive_cylinder_add(vertices=verts, radius=radius, depth=h, location=(x, y, z + h / 2))
    ob = bpy.context.active_object
    ob.name = name
    ob.data.materials.append(mat)
    mod = ob.modifiers.new("edge", "BEVEL")
    mod.width = min(0.01, h / 3)
    mod.segments = 2
    mod.limit_method = "ANGLE"
    bpy.ops.object.shade_smooth()
    if parent:
        ob.parent = parent
    return ob


def layer(name):
    empty = bpy.data.objects.new(name, None)
    bpy.context.collection.objects.link(empty)
    return empty


def cut(target, cutter):
    mod = target.modifiers.new("cut", "BOOLEAN")
    mod.operation = "DIFFERENCE"
    mod.object = cutter
    mod.solver = "EXACT"
    bpy.context.view_layer.objects.active = target
    bpy.ops.object.modifier_apply(modifier="cut")
    bpy.data.objects.remove(cutter)


# ── Layers, bottom to top: (empty, collapsed height) ──
layers = []

# 0 · Cherry back, with a camera window
back = layer("L0 Back")
wood = slab("Wood back", W, D, 0.1, 0.42, MAT["wood"], parent=back)
layers.append((back, 0.1))

# 1 · Aluminium frame with side keys
frame = layer("L1 Frame")
outer = slab("Frame", W, D, 0.16, 0.42, MAT["aluminium"], edge=0.0)
inner = slab("Frame cut", W - 0.16, D - 0.16, 0.4, 0.34, MAT["aluminium"], z=-0.1, edge=0.0)
cut(outer, inner)
bev = outer.modifiers.new("edge", "BEVEL")
bev.width = 0.02
bev.segments = 3
bev.limit_method = "ANGLE"
bev.harden_normals = True
outer.parent = frame
for i, (yy, length) in enumerate([(0.9, 0.5), (0.25, 0.28), (-0.15, 0.28)]):
    slab(f"Key {i}", 0.04, length, 0.06, 0.02, MAT["aluminium"], x=W / 2 + 0.01, y=yy, z=0.05, edge=0.008, parent=frame)
layers.append((frame, 0.16))

# 2 · Logic board, battery, camera module and flex cable
board = layer("L2 Board")
slab("Board", W - 0.3, D - 0.5, 0.04, 0.24, MAT["titanium"], parent=board)
for name, x, y, w, d, h, m in [
    ("SoC", -0.35, 1.1, 0.7, 0.5, 0.07, MAT["steel"]),
    ("Memory", 0.45, 1.15, 0.35, 0.35, 0.06, MAT["graphite"]),
    ("Battery", 0.0, -0.2, 1.3, 1.4, 0.09, MAT["graphite"]),
    ("Flex", 0.35, 1.45, 0.5, 0.18, 0.03, MAT["cherry"]),
]:
    slab(name, w, d, h, min(w, d) * 0.18, m, x=x, y=y, z=0.04, edge=0.01, parent=board)
cam = slab("Camera", 0.55, 0.55, 0.08, 0.14, MAT["aluminium"], x=-0.45, y=1.55, z=0.04, edge=0.01, parent=board)
for i, (cx, cy) in enumerate([(-0.57, 1.67), (-0.33, 1.43)]):
    cylinder(f"Lens ring {i}", 0.1, 0.05, MAT["steel"], x=cx, y=cy, z=0.12, parent=board)
    cylinder(f"Lens {i}", 0.07, 0.06, MAT["lens"], x=cx, y=cy, z=0.12, parent=board)
for i, (sx, sy) in enumerate([(-0.85, 1.85), (0.85, 1.85), (-0.85, -1.85), (0.85, -1.85)]):
    cylinder(f"Screw {i}", 0.035, 0.03, MAT["aluminium"], x=sx, y=sy, z=0.04, parent=board, verts=16)
layers.append((board, 0.12))

# 3 · Interface surface
surface = layer("L3 Surface")
slab("Surface", W - 0.16, D - 0.16, 0.03, 0.34, MAT["screen"], edge=0.008, parent=surface)
layers.append((surface, 0.03))

# 4 · Content: hero card and cards
content = layer("L4 Content")
slab("Hero card", 1.7, 1.3, 0.05, 0.14, MAT["cherry_glow"], y=1.2, edge=0.01, parent=content)
for i, (x, y, w, d) in enumerate([(-0.43, -0.2, 0.84, 0.95), (0.43, -0.2, 0.84, 0.95), (0, -1.15, 1.7, 0.6)]):
    slab(f"Card {i}", w, d, 0.05, 0.12, MAT["steel"], x=x, y=y, edge=0.01, parent=content)
layers.append((content, 0.05))

# 5 · Controls: type lines, chips, action button and tab bar
controls = layer("L5 Controls")
for i, (x, y, w) in enumerate([(-0.35, 1.62, 1.0), (-0.55, 1.47, 0.6), (-0.6, 0.0, 0.5), (0.26, 0.0, 0.5)]):
    slab(f"Line {i}", w, 0.07, 0.03, 0.035, MAT["fog"], x=x, y=y, edge=0.005, parent=controls)
for i, x in enumerate([-0.55, -0.05]):
    slab(f"Chip {i}", 0.42, 0.16, 0.04, 0.08, MAT["aluminium"], x=x, y=-0.95, edge=0.008, parent=controls)
cylinder("Action", 0.2, 0.08, MAT["cherry"], x=0.62, y=-1.2, parent=controls)
slab("Tab bar", 1.3, 0.26, 0.05, 0.13, MAT["graphite"], y=-1.88, edge=0.01, parent=controls)
layers.append((controls, 0.08))

# 6 · Cover glass
cover = layer("L6 Glass")
slab("Cover glass", W - 0.06, D - 0.06, 0.04, 0.4, MAT["glass"], edge=0.012, parent=cover)
layers.append((cover, 0.04))


# ── Bake the wood grain to an image so it exports ──
def bake_wood(ob):
    bpy.context.view_layer.objects.active = ob
    for o in bpy.context.selected_objects:
        o.select_set(False)
    ob.select_set(True)
    bpy.ops.object.mode_set(mode="EDIT")
    bpy.ops.mesh.select_all(action="SELECT")
    bpy.ops.uv.cube_project(cube_size=W * 1.05, correct_aspect=True)
    bpy.ops.object.mode_set(mode="OBJECT")
    img = bpy.data.images.new("wood", 1024, 2048)
    nt = ob.active_material.node_tree
    node = nt.nodes.new("ShaderNodeTexImage")
    node.image = img
    nt.nodes.active = node
    scene.render.engine = "CYCLES"
    scene.cycles.samples = 4
    scene.cycles.device = "CPU"
    bpy.ops.object.bake(type="DIFFUSE", pass_filter={"COLOR"}, margin=8)
    img.filepath_raw = BAKE
    img.file_format = "PNG"
    img.save()
    # Swap the procedural tree for the baked image.
    bsdf = nt.nodes["Principled BSDF"]
    keep = {bsdf, node, nt.nodes["Material Output"]}
    for n in list(nt.nodes):
        if n not in keep:
            nt.nodes.remove(n)
    nt.links.new(node.outputs["Color"], bsdf.inputs["Base Color"])


bake_wood(wood)


# ── Explode animation ──
def ease_out(action):
    for fc in action.fcurves:
        for kp in fc.keyframe_points:
            kp.interpolation = "EXPO"
            kp.easing = "EASE_OUT"


base = 0.0
for index, (empty, height) in enumerate(layers):
    empty.location = (0, 0, base)
    empty.keyframe_insert("location", frame=1)
    empty.location = (0, 0, base + index * GAP)
    empty.keyframe_insert("location", frame=FRAMES)
    ease_out(empty.animation_data.action)
    base += height

# One clip for the whole stack, named for the loader.
for empty, _ in layers:
    track = empty.animation_data.nla_tracks.new()
    track.name = "explode"
    track.strips.new("explode", 1, empty.animation_data.action)
    empty.animation_data.action = None

bpy.ops.export_scene.gltf(
    filepath=OUT,
    export_format="GLB",
    export_apply=True,
    export_yup=True,
    export_animations=True,
    export_animation_mode="NLA_TRACKS",
    export_image_format="WEBP",
    export_image_quality=82,
)
os.remove(BAKE)
print("Exported", OUT, os.path.getsize(OUT) // 1024, "KB")
