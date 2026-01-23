"use client";

import React from "react";
import {
  AvatarGroup,
  Carousel,
  Column,
  Flex,
  Heading,
  SmartLink,
  Text,
} from "@once-ui-system/core";

interface ProjectCardProps {
  href: string;
  images: string[];
  title: string;
  content: string;
  description: string;
  avatars: { src: string }[];
  link: string;
}

/**
 * ProjectCard — CLS-safe
 * Principios:
 * - El layout SIEMPRE es estable desde el primer paint
 * - Carousel vive dentro de un contenedor con aspect-ratio fijo
 * - Slots opcionales reservan espacio
 */
export const ProjectCard: React.FC<ProjectCardProps> = ({
  href,
  images = [],
  title,
  content,
  description,
  avatars = [],
  link,
}) => {
  const hasImages = images.length > 0;
  const hasAvatars = avatars.length > 0;
  const hasDescription = Boolean(description?.trim());
  const hasCaseStudy = Boolean(content?.trim());
  const hasExternalLink = Boolean(link?.trim());

  return (
    <Column fillWidth gap="m">
      {/* MEDIA SLOT — la caja manda, no el Carousel */}
      <div
        style={{
          width: "100%",
          aspectRatio: "16 / 9",
          overflow: "hidden",
          borderRadius: "12px",
        }}
      >
        {hasImages ? (
          <Carousel
            sizes="(max-width: 960px) 100vw, 960px"
            items={images.map((image) => ({
              slide: image,
              alt: title,
            }))}
          />
        ) : (
          // Placeholder para estabilidad total
          <div
            aria-hidden
            style={{
              width: "100%",
              height: "100%",
              background: "rgba(0,0,0,0.04)",
            }}
          />
        )}
      </div>

      <Flex
        s={{ direction: "column" }}
        fillWidth
        paddingX="s"
        paddingTop="12"
        paddingBottom="24"
        gap="l"
      >
        {/* TITLE SLOT — altura acotada */}
        <Heading
          as="h2"
          wrap="balance"
          variant="heading-strong-xl"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {title}
        </Heading>

        <Column gap="16">
          {/* AVATARS SLOT — siempre existe */}
          <div style={{ minHeight: 40 }}>
            {hasAvatars ? (
              <AvatarGroup avatars={avatars} size="m" reverse />
            ) : (
              <span aria-hidden />
            )}
          </div>

          {/* DESCRIPTION SLOT — siempre reservado */}
          <div style={{ minHeight: 44 }}>
            {hasDescription ? (
              <Text
                wrap="balance"
                variant="body-default-s"
                onBackground="neutral-weak"
                style={{
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {description}
              </Text>
            ) : (
              <span aria-hidden />
            )}
          </div>

          {/* CTA SLOT — layout estable */}
          <Flex gap="24" wrap align="center" style={{ minHeight: 22 }}>
            <div style={{ minWidth: 140 }}>
              {hasCaseStudy ? (
                <SmartLink suffixIcon="arrowRight" href={href}>
                  <Text variant="body-default-s">Read case study</Text>
                </SmartLink>
              ) : (
                <span aria-hidden />
              )}
            </div>

            <div style={{ minWidth: 120 }}>
              {hasExternalLink ? (
                <SmartLink suffixIcon="arrowUpRightFromSquare" href={link}>
                  <Text variant="body-default-s">View project</Text>
                </SmartLink>
              ) : (
                <span aria-hidden />
              )}
            </div>
          </Flex>
        </Column>
      </Flex>
    </Column>
  );
};
