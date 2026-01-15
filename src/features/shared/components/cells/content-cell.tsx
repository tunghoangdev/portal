type IProps = {
	value: string;
}

 const ContentCell = (props: IProps) => {
	const { value } = props;
    if(!value) return null;
  return (
    <div dangerouslySetInnerHTML={{ __html: value }} />
  )
}

ContentCell.displayName = 'ContentCell';


const ContentRevoCell = (h: any, { props }: any) => {
	const { value } = props;
    if(!value) return null;
	return h('div', { class: 'text-ellipsis',innerHTML: value });
};  
export { ContentCell, ContentRevoCell };