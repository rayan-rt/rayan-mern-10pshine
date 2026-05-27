type NavLink = {
  title: string;
  href: string;
};

const nav_links: NavLink[] = [
  {
    title: "Notes",
    href: "/notes",
  },
  {
    title: "Create a Note",
    href: "/create-note",
  },
];

export { nav_links, type NavLink };
