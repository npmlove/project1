<script>
export default {
  name: 'MenuItem',
  functional: true,
  props: {
    meta: {
      type: Object,
      default: () => {
        return {
          title: '',
          icon: ''
        }
      }
    }
  },
  render(h, context) {
    const { icon, title ,img} = context.props.meta
    const vnodes = []

    if (icon) {
      vnodes.push(<i class={'iconfont '+ icon} style={{marginRight:'5px'}}></i>)
    }
    if (img) {
      vnodes.push(<img src={img} style={{marginRight:'8px',width:'16px',height:'16px'}}></img>)
    }
    if (title) {
      vnodes.push(<span slot='title'>{(title)}</span>)
    }
    return vnodes
  }
}
</script>