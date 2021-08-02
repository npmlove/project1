<script>
  export default {
    name:'MenuItem',
    functional: true,

    props: {
      meta: {
        type:Object,
        default: ()=> {
          return {
            title: '',
            icon: '',
          }
        },
      },
    },
    render(h, context) {
      let collapse = sessionStorage.getItem('collapse')  //添加

      const { icon, title, affix } = context.props.meta
      const vnodes = []

      if (icon) {
        vnodes.push(<vab-icon icon={icon} />)
      }

      if (collapse == 'false') {
        console.log('侧边栏开' + collapse)
        if (title) {
          vnodes.push(<span slot="title" style="margin-left:5px;"> {title} </span>)
        }
      } else if (collapse == 'true') {
        console.log('侧边栏收'+ collapse)
        if (title && !icon) {
          vnodes.push(<span slot="title" style="margin-left:5px;">{title}</span>)
        }
      } else {
        if (title) {
          vnodes.push( <span slot="title" style="margin-left:5px;"> {title} </span>)
        }
      }

      return vnodes
    }
  }
</script>
  // if (title) {
  //   vnodes.push(<span slot='title'>{(title)}</span>)
  // }
