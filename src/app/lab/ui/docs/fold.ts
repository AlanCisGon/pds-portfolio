/** Sin acentos y en minúsculas: "molecula" encuentra "molécula". Lo usan el servidor y el cliente. */
export const fold = (s: string) => s.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();
