import type { Field } from "payload";

/**
 * Jalur komponen, bukan komponennya — berkas ini ikut termuat oleh CLI
 * `payload migrate` di luar Next, dan mengimpor berkas .tsx di sana akan
 * gagal (sama alasannya dengan judulBaris di rowLabel.ts).
 */
const LOCALE_REFERENCE = "/payload/components/LocaleReference#LocaleReference";

function withLocaleReference(field: Field): Field {
  const f = field as Record<string, unknown>;
  const admin = f.admin as Record<string, unknown> | undefined;
  const components = admin?.components as Record<string, unknown> | undefined;

  if (!f.localized || admin?.description || components?.Description) {
    return field;
  }

  return {
    ...f,
    admin: {
      ...admin,
      components: {
        ...components,
        Description: LOCALE_REFERENCE,
      },
    },
  } as Field;
}

/**
 * Tempel kotak referensi teks Indonesia (lihat LocaleReference.tsx) di setiap
 * field localized yang belum punya description sendiri — rekursif ke dalam
 * group/array/row/collapsible (.fields), blocks (.blocks[].fields), dan
 * tabs (.tabs[].fields).
 */
export function terapkanReferensiLokal(fields: Field[]): Field[] {
  return fields.map((fieldAsli) => {
    let field = withLocaleReference(fieldAsli) as Record<string, unknown>;

    if (Array.isArray(field.fields)) {
      field = { ...field, fields: terapkanReferensiLokal(field.fields as Field[]) };
    }
    if (Array.isArray(field.blocks)) {
      field = {
        ...field,
        blocks: (field.blocks as Array<Record<string, unknown>>).map((blok) => ({
          ...blok,
          fields: terapkanReferensiLokal(blok.fields as Field[]),
        })),
      };
    }
    if (Array.isArray(field.tabs)) {
      field = {
        ...field,
        tabs: (field.tabs as Array<Record<string, unknown>>).map((tab) => ({
          ...tab,
          fields: terapkanReferensiLokal(tab.fields as Field[]),
        })),
      };
    }
    return field as Field;
  });
}
