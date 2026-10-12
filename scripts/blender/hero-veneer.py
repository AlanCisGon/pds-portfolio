"""Abstract hero loop: a low-poly relief of irregular triangular facets in cherry, titanium and
honed aluminium, each pulsing out at random.

Run headless (Blender 4.2 LTS):
    blender -b --factory-startup --python scripts/blender/hero-veneer.py -- [--preview]

Writes public/videos/hero-veneer.mp4 (seamless loop) and public/videos/hero-veneer-poster.webp.
--preview renders only the poster frame, at low samples, to check the look quickly.

The loop is exact: every facet beats a whole number of times per FRAMES frames.
"""

import math
import os
import sys

import urllib.request

import bpy

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
OUT_DIR = os.path.join(ROOT, "public", "videos")
PREVIEW = "--preview" in sys.argv
CACHE = os.path.join(os.path.dirname(__file__), ".cache")

# CC0 assets from Poly Haven, downloaded once into scripts/blender/.cache (gitignored).
PH = "https://dl.polyhaven.org/file/ph-assets"
ASSETS = {
    "hdri": f"{PH}/HDRIs/hdr/2k/studio_small_09_2k.hdr",
    "wood_col": f"{PH}/Textures/jpg/2k/oak_veneer_01/oak_veneer_01_diff_2k.jpg",
    "wood_rough": f"{PH}/Textures/jpg/2k/oak_veneer_01/oak_veneer_01_rough_2k.jpg",
    "wood_nor": f"{PH}/Textures/jpg/2k/oak_veneer_01/oak_veneer_01_nor_gl_2k.jpg",
}


def asset(key):
    url = ASSETS[key]
    path = os.path.join(CACHE, os.path.basename(url))
    if not os.path.exists(path):
        os.makedirs(CACHE, exist_ok=True)
        urllib.request.urlretrieve(url, path)
    return path

FPS = 24
SECONDS = 5
FRAMES = FPS * SECONDS
RES = (1000, 930)  # 55% column at desktop sizes; the page crops it with object-fit

RIBBON_L = 10.0


def lin(hex_):
    h = hex_.lstrip("#")
    out = []
    for i in (0, 2, 4):
        c = int(h[i : i + 2], 16) / 255
        out.append(c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4)
    return (*out, 1.0)


bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene
scene.render.fps = FPS
scene.frame_start = 1
scene.frame_end = FRAMES
scene.render.resolution_x, scene.render.resolution_y = RES
scene.render.resolution_percentage = 100

# ── Render ──
scene.render.engine = "CYCLES"
scene.cycles.device = "CPU"
scene.cycles.samples = 12  # with OIDN; enough for a slow, sharp loop
scene.cycles.use_denoising = True
scene.cycles.denoiser = "OPENIMAGEDENOISE"
scene.cycles.max_bounces = 6
scene.render.use_motion_blur = False
scene.view_settings.view_transform = "AgX"
scene.view_settings.look = "AgX - Medium High Contrast"

# ── World: a studio HDRI lights and reflects; the camera still sees titanio ──
world = bpy.data.worlds.new("World")
scene.world = world
world.use_nodes = True
wt = world.node_tree
env = wt.nodes.new("ShaderNodeTexEnvironment")
env.image = bpy.data.images.load(asset("hdri"))
env_bg = wt.nodes["Background"]
env_bg.inputs["Strength"].default_value = 0.6
flat = wt.nodes.new("ShaderNodeBackground")
flat.inputs["Color"].default_value = lin("#0E1114")
path = wt.nodes.new("ShaderNodeLightPath")
mix = wt.nodes.new("ShaderNodeMixShader")
wt.links.new(env.outputs["Color"], env_bg.inputs["Color"])
wt.links.new(path.outputs["Is Camera Ray"], mix.inputs["Fac"])
wt.links.new(env_bg.outputs["Background"], mix.inputs[1])
wt.links.new(flat.outputs["Background"], mix.inputs[2])
wt.links.new(mix.outputs["Shader"], wt.nodes["World Output"].inputs["Surface"])


# ── Materials ──
def cherry_veneer():
    """Scanned oak veneer (Poly Haven), tinted towards cherry, box-projected so any tile gets grain."""
    m = bpy.data.materials.new("Cherry veneer")
    m.use_nodes = True
    nt = m.node_tree
    bsdf = nt.nodes["Principled BSDF"]
    bsdf.inputs["Coat Weight"].default_value = 0.2
    bsdf.inputs["Coat Roughness"].default_value = 0.2
    coord = nt.nodes.new("ShaderNodeTexCoord")
    mapping = nt.nodes.new("ShaderNodeMapping")
    mapping.inputs["Scale"].default_value = (0.9, 0.9, 0.9)

    def image(key, non_color=False):
        node = nt.nodes.new("ShaderNodeTexImage")
        node.image = bpy.data.images.load(asset(key))
        if non_color:
            node.image.colorspace_settings.name = "Non-Color"
        node.projection = "BOX"
        node.projection_blend = 0.15
        nt.links.new(mapping.outputs["Vector"], node.inputs["Vector"])
        return node

    nt.links.new(coord.outputs["Object"], mapping.inputs["Vector"])
    col, rough, nor = image("wood_col"), image("wood_rough", True), image("wood_nor", True)
    tint = nt.nodes.new("ShaderNodeMix")
    tint.data_type = "RGBA"
    tint.blend_type = "MULTIPLY"
    tint.inputs["Factor"].default_value = 0.75
    tint.inputs["B"].default_value = lin("#E89A72")  # oak to cherry
    normal = nt.nodes.new("ShaderNodeNormalMap")
    normal.inputs["Strength"].default_value = 0.6
    nt.links.new(col.outputs["Color"], tint.inputs["A"])
    nt.links.new(tint.outputs["Result"], bsdf.inputs["Base Color"])
    nt.links.new(rough.outputs["Color"], bsdf.inputs["Roughness"])
    nt.links.new(nor.outputs["Color"], normal.inputs["Color"])
    nt.links.new(normal.outputs["Normal"], bsdf.inputs["Normal"])
    return m


def brushed_titanium():
    m = bpy.data.materials.new("Brushed titanium")
    m.use_nodes = True
    nt = m.node_tree
    bsdf = nt.nodes["Principled BSDF"]
    bsdf.inputs["Base Color"].default_value = lin("#9AA2AC")
    bsdf.inputs["Anisotropic"].default_value = 0.85
    bsdf.inputs["Metallic"].default_value = 0.8
    coord = nt.nodes.new("ShaderNodeTexCoord")
    mapping = nt.nodes.new("ShaderNodeMapping")
    mapping.inputs["Scale"].default_value = (0.4, 140.0, 1.0)  # fine brushing
    noise = nt.nodes.new("ShaderNodeTexNoise")
    noise.inputs["Scale"].default_value = 4.0
    noise.inputs["Detail"].default_value = 8.0
    rough = nt.nodes.new("ShaderNodeMapRange")
    rough.inputs["To Min"].default_value = 0.22
    rough.inputs["To Max"].default_value = 0.42
    nt.links.new(coord.outputs["Object"], mapping.inputs["Vector"])
    nt.links.new(mapping.outputs["Vector"], noise.inputs["Vector"])
    nt.links.new(noise.outputs["Fac"], rough.inputs["Value"])
    nt.links.new(rough.outputs["Result"], bsdf.inputs["Roughness"])
    return m


WOOD = cherry_veneer()
TITANIUM = brushed_titanium()

# ── Relief: an irregular triangulation (low-poly facets), mirrored about the centre ──
SPACING = 0.78  # mean distance between triangulation points
JITTER = 0.42  # fraction of SPACING each point wanders off its grid slot
EXTENT_X, EXTENT_Y = 4.4, 4.2
GAP = 0.022  # half the groove between neighbouring facets
AMP = 0.26  # how far a tile pushes out at the peak of a beat
SHARP = 6  # pulse exponent: higher = shorter, snappier beats

ALUMINIUM = bpy.data.materials.new("Aluminium")
ALUMINIUM.use_nodes = True
_b = ALUMINIUM.node_tree.nodes["Principled BSDF"]
_b.inputs["Base Color"].default_value = lin("#D4D8DD")
_b.inputs["Metallic"].default_value = 0.0
_b.inputs["Roughness"].default_value = 0.55  # honed, stone-like
TITANIUM.node_tree.nodes["Principled BSDF"].inputs["Base Color"].default_value = lin("#5A626C")


def hash01(a, b):
    """Deterministic pseudo-random in [0, 1) from two ints."""
    n = (a * 73856093) ^ (b * 19349663)
    n = (n ^ (n >> 13)) * 1274126177
    return ((n ^ (n >> 16)) & 0xFFFF) / 0x10000


def points():
    """Jittered grid on the right half; points on the axis stay on it so the mirror is seamless."""
    pts = []
    nx, ny = int(EXTENT_X / SPACING) + 1, int(EXTENT_Y / SPACING) + 1
    for j in range(-ny, ny + 1):
        for i in range(0, nx + 1):
            dy = (hash01(i, j + 500) - 0.5) * 2 * JITTER * SPACING
            x = (i + (0.5 if j % 2 else 0)) * SPACING
            if i == 0:
                x = 0.0
            else:
                x += (hash01(i, j) - 0.5) * 2 * JITTER * SPACING
            pts.append((x, j * SPACING * 0.87 + dy))
    return pts + [(-x, y) for x, y in pts if x > 1e-6]


def facet(name, tri, wall, chamfer, k):
    """Prism on an arbitrary triangle (incentre at origin): walls, then a chamfer to a smaller cap.
    Inset about the incentre so the groove is the same width on every edge."""
    (ax, ay), (bx, by), (cx, cy) = tri
    la, lb, lc = math.dist(tri[1], tri[2]), math.dist(tri[0], tri[2]), math.dist(tri[0], tri[1])
    per = la + lb + lc
    ix, iy = (la * ax + lb * bx + lc * cx) / per, (la * ay + lb * by + lc * cy) / per
    area = abs((bx - ax) * (cy - ay) - (cx - ax) * (by - ay)) / 2
    inr = 2 * area / per
    base = max(inr - GAP, inr * 0.3) / inr
    local = [(x - ix, y - iy) for x, y in tri]
    if (bx - ax) * (cy - ay) - (cx - ax) * (by - ay) < 0:
        local.reverse()  # counter-clockwise so normals face the camera
    rings = [(0.0, base), (wall, base), (wall + chamfer, base * k)]
    verts = [(x * sc, y * sc, z) for z, sc in rings for x, y in local]
    faces = []
    for r in range(len(rings) - 1):
        for j in range(3):
            a, b = r * 3 + j, r * 3 + (j + 1) % 3
            faces.append((a, b, b + 3, a + 3))
    faces.append((6, 7, 8))
    me = bpy.data.meshes.new(name)
    me.from_pydata(verts, [], faces)
    me.update()
    me.validate()
    for poly in me.polygons:
        poly.use_smooth = False
    return me, (ix, iy), inr


from mathutils import Vector
from mathutils.geometry import delaunay_2d_cdt

pts = points()
vco, _, tris, *_ = delaunay_2d_cdt([Vector(p) for p in pts], [], [], 0, 1e-5)

wall_rig = bpy.data.objects.new("Relief", None)
scene.collection.objects.link(wall_rig)
tiles = []
for n, t in enumerate(tris):
    tri = [(vco[i].x, vco[i].y) for i in t]
    cx = sum(p[0] for p in tri) / 3
    cy = sum(p[1] for p in tri) / 3
    # Mirrored seed: the facet and its reflection share material, profile and rhythm.
    key = (int(round(abs(cx) * 100)), int(round(cy * 100)))
    h = hash01(*key)
    shape = [(0.22, 0.08, 0.66), (0.3, 0.14, 0.45), (0.18, 0.05, 0.8)][int(h * 9) % 3]
    me, (ix, iy), inr = facet(f"facet-{n}", tri, *shape)
    if inr < 0.04:
        bpy.data.meshes.remove(me)  # slivers on the hull
        continue
    if abs(cx) < 0.5 and hash01(key[1], 7) < 0.6:
        mat = WOOD
    elif h < 0.5:
        mat = WOOD
    elif h < 0.75:
        mat = ALUMINIUM
    else:
        mat = TITANIUM
    me.materials.append(mat)
    ob = bpy.data.objects.new(f"Facet {n}", me)
    scene.collection.objects.link(ob)
    ob.parent = wall_rig
    ob.location = (ix, iy, 0)
    bev = ob.modifiers.new("edge", "BEVEL")
    bev.width = 0.012
    bev.segments = 2
    bev.limit_method = "ANGLE"
    bev.harden_normals = True
    tiles.append((ob, key))

# Random pulse: each facet beats 1-3 times per loop at its own phase and strength.
# Integer beats per loop keep it seamless; the high power keeps facets at rest between beats.
STEP = 2
for ob, key in tiles:
    beats = 1 + int(hash01(key[0] + 31, key[1]) * 3)
    phase = hash01(key[0], key[1] + 77)
    amp = AMP * (0.35 + 0.65 * hash01(key[0] + 13, key[1] + 5))
    for f in range(1, FRAMES + 2, STEP):
        t = (f - 1) / FRAMES
        ob.location.z = amp * (0.5 + 0.5 * math.cos(2 * math.pi * (beats * t + phase))) ** SHARP
        ob.keyframe_insert("location", index=2, frame=f)
    for fc in ob.animation_data.action.fcurves:
        for kp in fc.keyframe_points:
            kp.interpolation = "BEZIER"

wall_rig.rotation_euler = (math.radians(0), 0, 0)

# ── Light: warm key, cool rim, soft fill ──
def area(name, loc, rot, energy, color, size):
    light = bpy.data.lights.new(name, "AREA")
    light.energy = energy
    light.color = color
    light.size = size
    ob = bpy.data.objects.new(name, light)
    scene.collection.objects.link(ob)
    ob.location = loc
    ob.rotation_euler = [math.radians(a) for a in rot]
    return ob


area("Key", (-5.0, 3.0, 3.2), (-50, -55, 0), 1100, (1.0, 0.86, 0.74), 2.5)
area("Rim", (4.0, 3.5, 1.6), (-70, 40, 30), 500, (0.75, 0.84, 1.0), 2.0)
area("Fill", (0, -6, 2.5), (70, 0, 0), 120, (1.0, 0.95, 0.9), 6.0)

# ── Camera: close and oblique, shallow focus ──
cam_data = bpy.data.cameras.new("Camera")
cam_data.lens = 50
cam_data.dof.use_dof = True
cam_data.dof.aperture_fstop = 5.6
cam = bpy.data.objects.new("Camera", cam_data)
scene.collection.objects.link(cam)
cam.location = (0.0, -1.8, 7.6)
target = bpy.data.objects.new("Target", None)
scene.collection.objects.link(target)
target.location = (0.0, 0.0, 0.0)
track = cam.constraints.new("TRACK_TO")
track.target = target
track.track_axis = "TRACK_NEGATIVE_Z"
track.up_axis = "UP_Y"
cam_data.dof.focus_object = target
scene.camera = cam

# ── Output ──
os.makedirs(OUT_DIR, exist_ok=True)
scene.frame_set(1)
scene.render.image_settings.file_format = "WEBP"
scene.render.image_settings.quality = 82
scene.render.filepath = os.path.join(OUT_DIR, "hero-veneer-poster.webp")
bpy.ops.render.render(write_still=True)

if not PREVIEW:
    scene.render.image_settings.file_format = "FFMPEG"
    scene.render.ffmpeg.format = "MPEG4"
    scene.render.ffmpeg.codec = "H264"
    scene.render.ffmpeg.constant_rate_factor = "MEDIUM"
    scene.render.ffmpeg.ffmpeg_preset = "BEST"
    scene.render.ffmpeg.gopsize = FPS
    scene.render.filepath = os.path.join(OUT_DIR, "hero-veneer.mp4")
    bpy.ops.render.render(animation=True)
    print("Rendered", scene.render.filepath)
