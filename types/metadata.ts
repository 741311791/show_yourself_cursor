export interface ResumeMetadata {
  template: string;
  layout: string[][][];
  css: {
    value: string;
    visible: boolean;
  };
  page: {
    margin: number;
    format: string;
    options: {
      breakLine: boolean;
      pageNumbers: boolean;
    };
  };
  theme: {
    background: string;
    text: string;
    primary: string;
  };
  typography: {
    font: {
      family: string;
      subset: string;
      variants: string[];
      size: number;
    };
    lineHeight: number;
    hideIcons: boolean;
    underlineLinks: boolean;
  };
  notes: string;
}

export const defaultLayout = [
  [
    [
      "profile",
      "education",
      "work",
      "project",
      "student",
      "research",
      "research_result"
    ],
    [
      "skill",
      "hobby",
      "certificate",
      "award",
      "publication",
      "language"
    ],
  ],
];

export const defaultResumeMetadata: ResumeMetadata = {
  template: "rhyhorn",
  layout: defaultLayout,
  css: {
    value: ".section {\n\toutline: 1px solid #000;\n\toutline-offset: 4px;\n}",
    visible: false,
  },
  page: {
    margin: 18,
    format: "a4",
    options: {
      breakLine: true,
      pageNumbers: true,
    },
  },
  theme: {
    background: "#ffffff",
    text: "#000000",
    primary: "#dc2626",
  },
  typography: {
    font: {
      family: "IBM Plex Serif",
      subset: "latin",
      variants: ["regular", "italic", "600"],
      size: 14,
    },
    lineHeight: 1.5,
    hideIcons: false,
    underlineLinks: true,
  },
  notes: "",
};
