type DraftFields = { pico: string; cidade: string; setor: string };

export type CroquiDraft = DraftFields & { id: string };
const key = "aresta-intelligence-os:drafts:v1";

// O formulário só depende deste contrato. O workspace pode adotar uma implementação remota.
export interface CroquiDraftRepository {
  list(): CroquiDraft[];
  save(fields: DraftFields, id?: string): CroquiDraft;
}

export function readDraftFields(form: FormData): DraftFields {
  const fields = {
    pico: String(form.get("pico") || "").trim(),
    cidade: String(form.get("cidade") || "").trim(),
    setor: String(form.get("setor") || "").trim(),
  };
  if (!fields.pico || !fields.cidade) throw new Error("Preencha o nome do pico e a cidade.");
  if (Object.values(fields).some(value => value.length > 100)) {
    throw new Error("Use até 100 caracteres por campo.");
  }
  return fields;
}

function isDraft(value: unknown): value is CroquiDraft {
  if (!value || typeof value !== "object") return false;
  const draft = value as Record<string, unknown>;
  return ["id", "pico", "cidade", "setor"].every(field => typeof draft[field] === "string");
}

export function createLocalDraftRepository(): CroquiDraftRepository {
  function list(): CroquiDraft[] {
    try {
      const data: unknown = JSON.parse(localStorage.getItem(key) || "[]");
      return Array.isArray(data) ? data.filter(isDraft) : [];
    } catch {
      return [];
    }
  }

  function save(fields: DraftFields, id = crypto.randomUUID()): CroquiDraft {
    const draft = { ...fields, id };
    try {
      localStorage.setItem(key, JSON.stringify([draft, ...list().filter(item => item.id !== id)]));
      return draft;
    } catch {
      throw new Error("Não consegui salvar o rascunho neste navegador. Confira o espaço e as permissões de armazenamento.");
    }
  }

  return { list, save };
}
