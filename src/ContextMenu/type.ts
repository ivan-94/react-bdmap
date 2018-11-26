export interface IContextMenu {
  addItem(item: BMap.MenuItem): void
  removeItem(item: BMap.MenuItem): void
  addSep(sep: any): void
  removeSep(sep: any): void
}

export interface ContextMenuProps {
  /** @ignore 作为Marker的下级节点 */
  overlay?: BMap.Marker
  onOpen?: (event: { type: string; target: any; point: BMap.Point; pixel: BMap.Pixel }) => void
  onClose?: (event: { type: string; target: any; point: BMap.Point; pixel: BMap.Pixel }) => void
}

export interface ContextMenuSeparatorProps {
  /**
   * @ignore
   */
  contextMenu?: IContextMenu
}

export interface ContextMenuItemProps {
  children: string
  disabled?: boolean
  width?: number
  onClick?: () => void
  icon?: string
  /**
   * @ignore
   */
  contextMenu?: IContextMenu
}
