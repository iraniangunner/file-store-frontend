import { CategoryApi } from "@/types";

export const collectCategoryIds = (cats: CategoryApi[], selected: string[]) => {
  const ids = new Set<string>();
  const rootById: Record<number, CategoryApi> = {};

  const index = (nodes: CategoryApi[]) => {
    for (const n of nodes) {
      rootById[n.id] = n;
      if (n.children_recursive?.length) index(n.children_recursive);
    }
  };
  index(cats);

  for (const s of selected) {
    const id = Number(s);
    const node = rootById[id];
    if (node) {
      if (node.children_recursive?.length) {
        const visitChildren = (n: CategoryApi) => {
          (n.children_recursive || []).forEach((c) => {
            ids.add(String(c.id));
            visitChildren(c);
          });
        };
        visitChildren(node);
      } else {
        ids.add(s);
      }
    }
  }

  return Array.from(ids);
};

export const findCategoryName = (
  cats: CategoryApi[],
  id: number
): string | null => {
  for (const c of cats) {
    if (c.id === id) return c.name;
    if (c.children_recursive) {
      const found = findCategoryName(c.children_recursive, id);
      if (found) return found;
    }
  }
  return null;
};

export const findParents = (
  cats: CategoryApi[],
  id: number,
  parents: number[] = []
): any => {
  for (const c of cats) {
    if (c.id === id) return parents;
    if (c.children_recursive?.length) {
      const res = findParents(c.children_recursive, id, [...parents, c.id]);
      if (res) return res;
    }
  }
  return null;
};

export const findChildren = (node: CategoryApi) => {
  let ids: number[] = [];
  if (node.children_recursive?.length) {
    for (const child of node.children_recursive) {
      ids.push(child.id);
      ids = ids.concat(findChildren(child));
    }
  }
  return ids;
};

export const findCat = (
  cats: CategoryApi[],
  id: number
): CategoryApi | null => {
  for (const c of cats) {
    if (c.id === id) return c;
    if (c.children_recursive) {
      const f = findCat(c.children_recursive, id);
      if (f) return f;
    }
  }
  return null;
};

export const getAllDescendants = (node: CategoryApi): CategoryApi[] => {
  let result: CategoryApi[] = [];
  if (node.children_recursive) {
    node.children_recursive.forEach((child) => {
      result.push(child);
      result = result.concat(getAllDescendants(child));
    });
  }
  return result;
};
