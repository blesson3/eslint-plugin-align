/**
 * @fileoverview Rule to enforce ES6 import vertical alignment
 * @author Matt Blessed
 */

const REGEX_ES6_IMPORT_LINE = /^(import\s+.*?)(from.*$)/;

const SPACE = ' ';

declare type LineData = {  line: string; idx: number }

// Helpers

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    type    : 'layout',
    fixable : 'whitespace',
    messages: {
      missingWhitespace: "Missing space to align '{{ line }}'",
    },
  },
  create(context: any): any {
    const sourceCode = context.getSourceCode();

    function getImportGroup({ targetLineIdx }: { targetLineIdx: number }): LineData[] | undefined {
      const lineData = sourceCode.getText()
        .split('\n')
        .map((line: string, idx: number) => ({ idx, line }));
      const importLines = lineData.filter((data: LineData) => data.line.match(REGEX_ES6_IMPORT_LINE));

      const importGroups: LineData[][] = [];
      let lastIdx = 0;
      let groupIdx = 0;
      importLines.forEach((data: LineData) => {
        const { idx } = data;

        // if the line doesn't have an neighboring idx, then it's not part of this
        // group
        if (importGroups.length > 0 && idx !== lastIdx + 1) groupIdx += 1;

        // add the line to the appropriate group
        if (!importGroups[groupIdx]) importGroups[groupIdx] = [];
        importGroups[groupIdx].push(data);

        // set last idx
        lastIdx = idx;
      });

      // find the right group that matches by file line index
      return importGroups.find((group) => group.map((data) => data.idx).indexOf(targetLineIdx) !== -1);
    }

    /**
     * Verify alignment
     * @param {ASTNode} importDeclaration Property node from an object literal.
     * @returns {Object} Whitespace before and after the property's colon.
     */
    function verifyAlignment(importDeclaration: any): void {
      const sourceLines  = sourceCode.getText().split('\n');
      const [importLine] = sourceLines.slice(importDeclaration.loc.start.line - 1, importDeclaration.loc.end.line);
      const lineGroup    = getImportGroup({ targetLineIdx: importDeclaration.loc.start.line });

      if (!lineGroup || lineGroup.length === 0) {
        // if line group not exist, then the code is not valid in the first
        // place
        return;
      }

      const lineMatches = lineGroup.map((obj) => obj.line.match(REGEX_ES6_IMPORT_LINE));
      const linesComps = lineMatches.map((x) => x || '')
        .map((x) => ({
          left : x[1].trim(),
          right: x[2].trim(),
          line : x[0],
          idx  : lineGroup.find((data: LineData) => data.line === x[0])?.idx,
        }));

      const linesLeftSide          = linesComps.map((x) => x.left);
      const highestLengthPreAnchor = linesLeftSide.map((x) => x.length).sort((n1, n2) => n2 - n1)[0];

      const targetLineGroupIdx = linesComps.map((x) => x.line).indexOf(importLine);
      const targetLineCompObj  = linesComps[targetLineGroupIdx];
      const spaceNum           = highestLengthPreAnchor - targetLineCompObj.left.length + 1;
      const targetLineSpacing  = `${targetLineCompObj.left}${SPACE.repeat(spaceNum)}${targetLineCompObj.right}`;

      if (importLine !== targetLineSpacing) {
        // report an issue
        context.report({
          node     : importDeclaration,
          messageId: 'missingWhitespace',
          data     : {
            line: importLine,
          },
          fix(fixer: any) {
            // get the source code substring relevant to the group
            const groupSourceLineStart  = lineGroup[0].idx;
            const groupSourceLineEnd    = lineGroup[lineGroup.length - 1].idx + 1;
            const groupSourceRangeStart = sourceLines.slice(0, groupSourceLineStart)
              .reduce((pv: number, cv: string) => pv + cv.length + 1, 0);
            const groupSourceRangeEnd   = sourceLines.slice(groupSourceLineStart, groupSourceLineEnd)
              .reduce((pv: number, cv: string) => pv + cv.length + 1, 0);

            const groupSourceCode = sourceCode.getText().slice(groupSourceRangeStart, groupSourceRangeStart + groupSourceRangeEnd);

            // get range start and end of the target line to fix
            const leftRangeStart = groupSourceCode.indexOf(targetLineCompObj.left);
            const leftRangeEnd = leftRangeStart + targetLineCompObj.left.length;
            const rightRangeStart = groupSourceCode.indexOf(targetLineCompObj.right);

            // tell the fixer to add spaces between the ES6 import line
            // components
            const range = [groupSourceRangeStart + leftRangeEnd, groupSourceRangeStart + rightRangeStart];
            return fixer.replaceTextRange(range, SPACE.repeat(spaceNum));
          },
        });
      }
    }

    return {
      ImportDeclaration: (node: any): any => {
        verifyAlignment(node);
      },
    };
  },
};
