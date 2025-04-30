/**
 * https://discuss.prosemirror.net/t/add-css-class-to-current-node-or-selected-nodes/1287/7
 */
import { Plugin } from "prosemirror-state";
import { Decoration, DecorationSet } from "prosemirror-view";

export const selectPlugin = new Plugin({
	props: {
		decorations(state) {
			const selection = state.selection;
			const decorations: Decoration[] = [];

			state.doc.nodesBetween(selection.from, selection.to, (node, position) => {
				if (node.isBlock) {
					decorations.push(Decoration.node(position, position + node.nodeSize, { class: 'selected' }));
				}
			});

			return DecorationSet.create(state.doc, decorations);
		}
	}
});
