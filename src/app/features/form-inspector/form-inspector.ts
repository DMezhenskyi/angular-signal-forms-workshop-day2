import { Component, computed, inject, signal } from '@angular/core';
import { FieldTree } from '@angular/forms/signals';

import { FormConnector } from './form-connector';

interface InspectorRow {
  path: string;
  label: string;
  depth: number;
  group: boolean;
  expanded: boolean;
  field: FieldTree<unknown>;
}

/** A value that has child fields worth walking into (object literal or array). */
function isTraversable(value: unknown): value is Record<string, unknown> | unknown[] {
  if (value === null || typeof value !== 'object') {
    return false;
  }
  return Array.isArray(value) || Object.getPrototypeOf(value) === Object.prototype;
}

function childEntries(value: Record<string, unknown> | unknown[]): [string, unknown][] {
  return Array.isArray(value)
    ? value.map((item, index) => [String(index), item] as [string, unknown])
    : Object.entries(value);
}

function flatten(
  tree: FieldTree<unknown>,
  value: unknown,
  path: string,
  depth: number,
  collapsed: ReadonlySet<string>,
): InspectorRow[] {
  if (!isTraversable(value)) {
    return [];
  }
  const subfields = tree as unknown as Record<string, FieldTree<unknown> | undefined>;

  return childEntries(value).flatMap(([key, childValue]) => {
    const field = subfields[key];
    if (!field) {
      return [];
    }
    const childPath = path ? `${path}.${key}` : key;
    const group = isTraversable(childValue);
    const expanded = group && !collapsed.has(childPath);
    const row: InspectorRow = {
      path: childPath,
      label: key,
      depth,
      group,
      expanded,
      field,
    };
    return expanded ? [row, ...flatten(field, childValue, childPath, depth + 1, collapsed)] : [row];
  });
}

@Component({
  selector: 'df-form-inspector',
  styleUrls: ['./form-inspector.scss'],
  templateUrl: './form-inspector.html',
})
export class FormInspector {
  readonly #connector = inject(FormConnector);

  /** Paths of groups/arrays the user collapsed; everything is expanded by default. */
  readonly #collapsed = signal<ReadonlySet<string>>(new Set());

  protected readonly state = computed(() => this.#connector.field()?.());

  protected readonly json = computed(() => {
    const state = this.state();
    return state ? JSON.stringify(state.value(), null, 2) : '';
  });

  protected readonly rows = computed(() => {
    const tree = this.#connector.field();
    const state = this.state();
    if (!tree || !state) {
      return [];
    }
    return flatten(tree, state.value(), '', 0, this.#collapsed());
  });

  protected toggle(row: InspectorRow) {
    this.#collapsed.update((collapsed) => {
      const next = new Set(collapsed);
      if (!next.delete(row.path)) {
        next.add(row.path);
      }
      return next;
    });
  }
}
