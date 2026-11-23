export type Point = { x: number; y: number };
export type DraftMedia = { foto: string; linha: Point[] };
const textFields = ["pico","cidade","setor","via","grau","latitude","longitude","trilhaUrl","acesso","creditos","beta","betaUrl"] as const;
type DraftFields = Record<typeof textFields[number], string>;
export type CroquiDraft = DraftFields & DraftMedia & { id: string; territorioId: string };
type DraftInput = DraftFields & DraftMedia & { territorioId?: string };
const key = "aresta-intelligence-os:drafts:v1";

export interface CroquiDraftRepository {
  list(): CroquiDraft[];
  save(fields: DraftInput, id?: string): CroquiDraft;
}

export function isSectorPhoto(value: unknown): value is string {
  return typeof value === "string" && /^data:image\/(jpeg|png|webp);base64,[a-z0-9+/=]+$/i.test(value);
}

function isPoint(value: unknown): value is Point {
  if (!value || typeof value !== "object") return false;
  const {x,y} = value as Point;
  return Number.isFinite(x) && Number.isFinite(y) && x>=0 && x<=1 && y>=0 && y<=1;
}

class DraftFieldError extends Error {
  field: string;
  constructor(message: string, field: string) {
    super(message);
    this.field = field;
  }
}

export function readDraftFields(form: FormData): DraftFields {
  const fields = Object.fromEntries(textFields.map(field=>[field,String(form.get(field) || "").trim()])) as DraftFields;
  if (!fields.pico || !fields.cidade) throw new DraftFieldError("Preencha o nome do pico e a cidade.", !fields.pico?"pico":"cidade");
  for (const field of ["betaUrl", "trilhaUrl"] as const) {
    if (!fields[field]) continue;
    let url;
    try { url = new URL(fields[field]); } catch { throw new DraftFieldError("Confira o endereço do link.",field); }
    if (url.protocol !== "https:") throw new DraftFieldError("Use um link que comece com https://.",field);
  }
  for (const [field,limit] of [["latitude",90],["longitude",180]] as const) {
    if (!fields[field]) continue;
    const value = fields[field].replace(",",".");
    if (!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(value) || Math.abs(Number(value))>limit) {
      throw new DraftFieldError("Confira o valor da coordenada.",field);
    }
    fields[field] = String(Number(value));
  }
  if (Boolean(fields.latitude)!==Boolean(fields.longitude)) throw new DraftFieldError("Informe latitude e longitude juntas.",!fields.latitude?"latitude":"longitude");
  return fields;
}

function readDraft(value: unknown): CroquiDraft | null {
  if (!value || typeof value !== "object") return null;
  const raw = value as Record<string, unknown>;
  if (typeof raw.id !== "string" || typeof raw.pico !== "string" || typeof raw.cidade !== "string") return null;
  const fields = Object.fromEntries(textFields.map(key=>[key, typeof raw[key]==="string"?raw[key]:""])) as DraftFields;
  const foto = isSectorPhoto(raw.foto)?raw.foto:"";
  const linha = foto && Array.isArray(raw.linha)?raw.linha.filter(isPoint).slice(0,200):[];
  return {...fields,id:raw.id,territorioId:typeof raw.territorioId==="string"?raw.territorioId:"",foto,linha};
}

export function createLocalDraftRepository(): CroquiDraftRepository {
  function list(): CroquiDraft[] {
    try {
      const data: unknown = JSON.parse(localStorage.getItem(key) || "[]");
      return Array.isArray(data) ? data.map(readDraft).filter((item):item is CroquiDraft=>item!==null) : [];
    } catch {
      return [];
    }
  }

  function save(fields: DraftInput, id = crypto.randomUUID()): CroquiDraft {
    const draft = {...fields,id,territorioId:fields.territorioId||""};
    try {
      localStorage.setItem(key, JSON.stringify([draft, ...list().filter(item => item.id !== id)]));
      return draft;
    } catch {
      throw new Error("Não foi possível salvar. Use uma foto menor ou confira o armazenamento do navegador.");
    }
  }

  return {list, save};
}
