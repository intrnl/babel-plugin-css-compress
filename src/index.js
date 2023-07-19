import { declare } from '@babel/helper-plugin-utils';

import { customAlphabet } from 'nanoid/non-secure';
import * as esbuild from 'esbuild';

const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_');

export default declare((api, config) => {
	const { types: t } = api;

	const styleTagNames = config.styleTagNames ?? ['css'];
	const keyframesTagNames = config.keyframesTagNames ?? ['keyframes'];
	const globalTagNames = config.globalTagNames;

	const rid = nanoid(24);
	const ridMatcher = new RegExp(`__${rid}_(\\d+)__`, 'g');

	/**
	 * @param {import('@babel/core').NodePath<import('@babel/types').TaggedTemplateExpression>} path
	 * @param {(str: string) => string} bake
	 * @param {(str: string) => string} unbake
	 */
	const build = (path, bake, unbake) => {
		/** @type {import('@babel/core').NodePath<import('@babel/types').TemplateLiteral>} */
		const quasi = path.get('quasi');

		const elements = quasi.get('quasis');
		const expressions = quasi.get('expressions');

		let str = elements[0].node.value.raw;

		for (let idx = 1, len = elements.length; idx < len; idx++) {
			const expr = expressions[idx - 1];
			const elem = elements[idx];

			const result = expr.evaluate();

			if (result.confident) {
				str += result.value;
			} else {
				str += `__${rid}_${idx - 1}__`;
			}

			str += elem.node.value.raw;
		}

		const result = esbuild.transformSync(bake(str), {
			loader: 'css',
			minify: true,
			// force enable nesting support regardless of target
			supported: { nesting: true },
		});

		str = unbake(result.code.trim());

		/** @type {RegExpMatchArray[]} */
		const matches = Array.from(str.matchAll(ridMatcher));

		const newElements = [];
		const newExpressions = [];

		let index = 0;

		for (let idx = 0, len = matches.length; idx < len; idx++) {
			const match = matches[idx];
			const int = +match[1];

			newElements.push(t.templateElement({ raw: str.slice(index, match.index) }));
			newExpressions.push(expressions[int].node);

			index = match.index + match[0].length;
		}

		newElements.push(t.templateElement({ raw: str.slice(index) }));
		quasi.replaceWith(t.templateLiteral(newElements, newExpressions));
	};

	return {
		name: '@intrnl/babel-plugin-css-compress',
		visitor: {
			TaggedTemplateExpression(path) {
				const tag = path.node.tag;

				if (!t.isIdentifier(tag)) {
					return;
				}

				const name = tag.name;

				if (styleTagNames && styleTagNames.includes(name)) {
					build(
						path,
						(body) => `*{${body}}`,
						(baked) => baked.slice(2, -1),
					);
				} else if (keyframesTagNames && keyframesTagNames.includes(name)) {
					build(
						path,
						(body) => `@keyframes f{${body}}`,
						(baked) => baked.slice(13, -1),
					);
				} else if (globalTagNames && globalTagNames.includes(name)) {
					build(
						path,
						(body) => body,
						(baked) => baked,
					);
				}
			},
		},
	};
});
