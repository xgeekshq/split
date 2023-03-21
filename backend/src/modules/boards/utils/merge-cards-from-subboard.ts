import Column from 'src/modules/columns/entities/column.schema';

/**
 * Method to merge cards from sub-board into a main board
 * @param columns: Column[]
 * @param subColumns: Column[]
 * @return Column[]
 */
export const mergeCardsFromSubBoardColumnsIntoMainBoard = (
	columns: Column[],
	subColumns: Column[]
) => {
	for (let i = 0; i < columns.length; i++) {
		columns[i].cards = [...columns[i].cards, ...subColumns[i].cards];
	}

	return columns;
};
