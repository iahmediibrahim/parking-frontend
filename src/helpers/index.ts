export const formatCategoryName = (categoryId: string): string => {
	const cleanedCategory = categoryId.replace('cat_', '')
	return `${cleanedCategory.charAt(0).toUpperCase()}${cleanedCategory.slice(
		1,
	)} Category`
}
