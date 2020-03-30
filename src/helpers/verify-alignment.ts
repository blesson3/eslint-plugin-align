declare type LineData = {  line: string; idx: number }

const SPACE = ' ';

/**
 * // TODO: write the function signature
 */
function getLineGroup({ sourceCode }: { sourceCode: any }, { targetLineIdx, lineMatch }: { targetLineIdx: number; lineMatch: RegExp }): LineData[] | undefined {
  const lineData = sourceCode.getText()
    .split('\n')
    .map((line: string, idx: number) => ({ idx, line }));
  // console.log(`All line data: ${JSON.stringify(lineData)}`);
  const matchingLines = lineData.filter((data: LineData) => data.line.trim().match(lineMatch));

  // console.log(`Matching lines: ${JSON.stringify(matchingLines)}`);

  const lineGroups: LineData[][] = [];
  let lastIdx = 0;
  let groupIdx = 0;
  matchingLines.forEach((data: LineData) => {
    const { idx } = data;

    // if the line doesn't have an neighboring idx, then it's not part of this
    // group
    if (lineGroups.length > 0 && idx !== lastIdx + 1) groupIdx += 1;

    // add the line to the appropriate group
    if (!lineGroups[groupIdx]) lineGroups[groupIdx] = [];
    lineGroups[groupIdx].push(data);

    // set last idx
    lastIdx = idx;
  });

  // find the right group that matches by file line index
  return lineGroups.find((group) => group.map((data) => data.idx).indexOf(targetLineIdx) !== -1);
}


/**
 * Verify alignment
 *
 * // TODO: write the function signature...
 */
export default function verifyAlignment({ sourceCode, context }: { sourceCode: any; context: any },
  { node, lineMatch }: { node: any; lineMatch: RegExp }): void
{
  const sourceLines = sourceCode.getText().split('\n');
  // TODO: handle multiple lines
  const [sourceLine] = sourceLines.slice(node.loc.start.line - 1, node.loc.end.line);
  const lineGroup    = getLineGroup({ sourceCode }, { targetLineIdx: node.loc.start.line - 1, lineMatch });

  if (!lineGroup || lineGroup.length === 0) {
    // if line group not exist, then the code is not valid in the first
    // place
    return;
  }

  const lineMatches = lineGroup.map((obj) => obj.line.match(lineMatch));
  const linesComps = lineMatches.map((x) => x || '')
    .map((x) => ({
      left : x[1].trim(),
      right: x[2].trim(),
      line : x[0],
      idx  : lineGroup.find((data: LineData) => data.line === x[0])?.idx,
    }));

  const linesLeftSide          = linesComps.map((x) => x.left);
  const highestLengthPreAnchor = linesLeftSide.map((x) => x.length).sort((n1, n2) => n2 - n1)[0];

  const targetLineGroupIdx = linesComps.map((x) => x.line).indexOf(sourceLine);
  const targetLineCompObj  = linesComps[targetLineGroupIdx];
  const spaceNum           = highestLengthPreAnchor - targetLineCompObj.left.length + 1;
  const targetLineSpacing  = `${targetLineCompObj.left}${SPACE.repeat(spaceNum)}${targetLineCompObj.right}`;

  // console.log(`Line:   ${sourceLine}`);
  // console.log(`Target: ${targetLineSpacing}`);
  // console.log('\n\n');

  if (sourceLine !== targetLineSpacing) {
    // report an issue
    context.report({
      node,
      messageId: 'missingWhitespace',
      data     : {
        line: sourceLine,
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

        // tell the fixer to add spaces between the line components
        const range = [groupSourceRangeStart + leftRangeEnd, groupSourceRangeStart + rightRangeStart];
        return fixer.replaceTextRange(range, SPACE.repeat(spaceNum));
      },
    });
  }
}