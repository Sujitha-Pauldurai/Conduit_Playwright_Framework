import * as fs from "fs";
import * as path from "path";

const ARTICLE_FILE = path.resolve("test-data/Article.json");

export function updateValue(key:string,suffix: string): string {
    const json = JSON.parse(fs.readFileSync(ARTICLE_FILE, "utf-8"));

    const keys = key.split(".");
    const last = keys.pop()!;
    const parent = keys.reduce((obj: any, k: string) => obj[k], json);
       
    parent[last] = `${String(parent[last]).replace(/_\d+$/, "")}_${suffix}`;
    fs.writeFileSync(ARTICLE_FILE, JSON.stringify(json, null, 4), "utf-8");
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