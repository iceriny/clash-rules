import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import YAML from 'yaml';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export const FILES = ['DIRECT', 'UNKNOWN', 'US', 'HK', 'TW', 'JP', 'SG', 'KR', 'EU', 'CA', 'REJECT'];
const TYPES = new Set(['DOMAIN', 'DOMAIN-SUFFIX', 'DOMAIN-KEYWORD', 'DOMAIN-REGEX', 'IP-CIDR', 'IP-CIDR6', 'IP-ASN', 'GEOIP', 'GEOSITE', 'DST-PORT', 'SRC-PORT', 'SRC-IP-CIDR', 'SRC-IP-CIDR6', 'PROCESS-NAME', 'PROCESS-PATH', 'NETWORK', 'AND', 'OR', 'NOT', 'IN-TYPE', 'IN-PORT', 'IN-USER', 'IN-NAME', 'UID', 'DSCP']);
export function readRules(name) {
  const text = readFileSync(resolve(ROOT, `${name}.yaml`), 'utf8');
  if (/ghp_|github_pat_|PRIVATE KEY|password\s*:|uuid\s*:|iceriny|lolo|192\.6\.161\.66/i.test(text)) throw new Error(`公开内容检查失败：${name}.yaml`);
  const doc = YAML.parse(text);
  if (!doc || Object.keys(doc).some(k => k !== 'payload') || !Array.isArray(doc.payload)) throw new Error(`规则格式错误：${name}.yaml`);
  for (const rule of doc.payload) if (typeof rule !== 'string' || !TYPES.has(rule.split(',')[0]) || rule.includes('\n')) throw new Error(`不支持的规则格式：${name}.yaml`);
  return doc;
}
try {
  const check = process.argv.includes('--check');
  if (!check) mkdirSync(resolve(ROOT, 'dist'), { recursive: true });
  for (const name of FILES) {
    const doc = readRules(name);
    if (!check) writeFileSync(resolve(ROOT, 'dist', `${name}.yaml`), YAML.stringify(doc), 'utf8');
  }
  if (!check) {
    writeFileSync(resolve(ROOT, 'dist', '_headers'), '/*.yaml\n  Content-Type: application/yaml; charset=utf-8\n  Cache-Control: public, max-age=300\n  Access-Control-Allow-Origin: *\n', 'utf8');
    writeFileSync(resolve(ROOT, 'dist', 'index.html'), '<!doctype html><meta charset="utf-8"><title>公共分流规则</title><h1>公共分流规则</h1><ul>'+FILES.map(n=>`<li><a href="${n}.yaml">${n}.yaml</a></li>`).join('')+'</ul>');
  }
  console.log(`${FILES.length} 个规则集合检查通过${check ? '' : '，镜像构建完成'}。`);
} catch (error) { console.error(error.message); process.exitCode = 1; }
