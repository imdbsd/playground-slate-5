import { DecorateHandlers } from '../composeDecorate'
const decorate: DecorateHandlers = (
  [node, path],
  prevDecorates,
  editor,
  next
) => {
  const decorates = [...prevDecorates]
  console.log('mention plugin decorates: ', { decorates })
  if (next) return next([node, path], decorates, editor)
  return decorates
}

export default decorate
