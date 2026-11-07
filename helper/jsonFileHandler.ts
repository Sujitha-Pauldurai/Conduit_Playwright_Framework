import * as fs from "fs";
import * as path from "path";

const ARTICLE_FILE = path.resolve("test-data/Article.json");

/* export function updateValue(key:string,suffix: string): string {
    const json = JSON.parse(fs.readFileSync(ARTICLE_FILE, "utf-8"));

    const keys = key.split(".");
    const last = keys.pop()!;
    const parent = keys.reduce((obj: any, k: string) => obj[k], json);
       
    parent[last] = `${String(parent[last]).replace(/_\d+$/, "")}_${suffix}`;
    fs.writeFileSync(ARTICLE_FILE, JSON.stringify(json, null, 4), "utf-8");
    return parent[last];
} */

export function updateUniqueTitle(key: string, suffix: string): string {
    const json = JSON.parse(fs.readFileSync(ARTICLE_FILE, 'utf-8'));

    const keys = key.split('.');
    const last = keys.pop()!;

    // Walk to the entry, e.g. "API_TC01_PUT" or "TC005_update"
    let parent: any = json;
    for (const k of keys) {
        if (parent == null || !(k in parent)) {
            throw new Error(
                `Key "${k}" not found while resolving "${key}". ` +
                `Top-level keys: ${Object.keys(json).join(', ')}`
            );
        }
        parent = parent[k];
    }

    // Some entries are wrapped in "article" (API shape), others are flat.
    // Check the wrapper only when the field isn't at this level.
    if (!(last in parent) && parent.article && last in parent.article) {
        parent = parent.article;
    }

    if (!(last in parent)) {
        throw new Error(`Field "${last}" not found while resolving "${key}" in ${ARTICLE_FILE}.`);
    }

    parent[last] = `${String(parent[last]).replace(/_\d+$/, '')}_${suffix}`;

    fs.writeFileSync(ARTICLE_FILE, JSON.stringify(json, null, 4));
    return parent[last];
}

export function readData() {
  return JSON.parse(fs.readFileSync(ARTICLE_FILE, "utf-8"));
}

export function updateData(key:string,value:string){

    const json = JSON.parse(fs.readFileSync(ARTICLE_FILE, "utf-8"));

    const keys = key.split(".");
    const last = keys.pop()!;
    const parent = keys.reduce((obj: any, k: string) => obj[k], json);
       
    parent[last] = value
    fs.writeFileSync(ARTICLE_FILE, JSON.stringify(json, null, 4), "utf-8");

}