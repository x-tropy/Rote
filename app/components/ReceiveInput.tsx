import { useState } from "react"
import { MenuItem } from "@blueprintjs/core"
import { MultiSelect, type ItemRendererProps } from "@blueprintjs/select"

type MyMultiSelectProps = {
	menuItems: string[]
	name: string
	allowCreate: boolean
	placeholder?: string
	icon?: string
	disabled?: boolean
}

export function MyMultiSelect({ menuItems, name, placeholder, icon, allowCreate, disabled }: MyMultiSelectProps) {
	const [selectedItems, setSelectedItems] = useState([] as string[])
	const isItemSelected = (tag: string) => selectedItems.includes(tag)
	function getTagItemProps(tag: string, { handleClick, handleFocus, modifiers, query, ref }: ItemRendererProps) {
		return {
			active: modifiers.active,
			disabled: modifiers.disabled,
			key: tag,
			onClick: handleClick,
			onFocus: handleFocus,
			ref
		}
	}
	const createItems = (query: string) => query.split(",").map(tag => tag.trim())
	const renderCreateMenuButton = (query: string, active: boolean, handleClick: React.MouseEventHandler<HTMLElement>) => {
		const newTags = query.split(",").map(tag => tag.trim())
		return (
			<MenuItem
				icon={icon as any}
				key='create-new-tag'
				text={`Create ${query
					.split(",")
					.map(tag => `"${tag.trim()}"`)
					.join(" and ")}`}
				roleStructure='none'
				active={active}
				onClick={e => {
					handleClick(e)
					setSelectedItems([...selectedItems, ...newTags])
				}}
				shouldDismissPopover={false}
			/>
		)
	}

	return (
		<>
			<input type='hidden' name={name} value={selectedItems.join(",")} />
			<MultiSelect
				disabled={disabled !== undefined ? disabled : false}
				items={menuItems}
				placeholder={placeholder !== undefined ? placeholder : "Select or type..."}
				createNewItemFromQuery={allowCreate ? createItems : undefined}
				createNewItemRenderer={allowCreate ? renderCreateMenuButton : undefined}
				itemPredicate={(query, tag) => tag.toLowerCase().includes(query.toLowerCase())}
				itemRenderer={(tag, props) => {
					if (!props.modifiers.matchesPredicate) {
						return null
					}
					return <MenuItem {...getTagItemProps(tag, props)} roleStructure='none' text={tag} key={tag} icon={isItemSelected(tag) ? "small-tick" : "blank"} shouldDismissPopover={false} />
				}}
				onRemove={tag => {
					setSelectedItems(selectedItems.filter(item => item !== tag))
				}}
				onClear={() => setSelectedItems([])}
				onItemSelect={tag => {
					if (!isItemSelected(tag)) {
						setSelectedItems([...selectedItems, tag])
					} else {
						setSelectedItems(selectedItems.filter(item => item !== tag))
					}
				}}
				popoverProps={{ minimal: true }}
				selectedItems={selectedItems}
				resetOnSelect={true}
				tagRenderer={tag => tag}
				tagInputProps={{ leftIcon: icon as any }}
			/>
		</>
	)
}
