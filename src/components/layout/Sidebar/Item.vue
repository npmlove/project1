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
    },
    leftWidth:{
      type:Boolean,
      default:()=>false
    },
    isTop:{
      type:Boolean,
      default:()=>false
    },
  },
  render(h, context) {
    const { icon, title ,img} = context.props.meta
    let leftWidth = context.props.leftWidth
    let isTop = context.props.isTop
    // console.log(leftWidth,isTop,title)
    const vnodes = []
    if (icon) {
      vnodes.push(<i class={'iconfont '+ icon} style={{marginRight:'5px'}}></i>)
    }
    if (img) {
      vnodes.push(<img src={img} style={{marginRight:'8px',width:'16px',height:'16px'}}></img>)
    }
    if (title) {
      if(leftWidth){
        vnodes.push(<span slot='title'>{(title)}</span>)
      }

      if(!isTop && !leftWidth){
        vnodes.push(<span slot='title'>{(title)}</span>)
      }
    }
    return vnodes
  }
}
</script>

