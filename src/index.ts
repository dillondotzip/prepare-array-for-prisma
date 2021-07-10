import { isEqual } from "lodash"

type Options = {
  removedItemsMethod?: "delete" | "disconnect"
}

/**
 * helper to convert array-like fields into Prisma Api format
 * it converts arrays like [ 1,2,3 ] to something like { create: [1,2,3] }
 * @example
 * value = [ {name: 1}, {id: 2, name: 3} ]
 * initial = [ {id: 2, name: 2}, {id: 3} ]
 * prepareArrayField(value, initial)
 * // returns
 * {
 *    create: [ {name: 1} ],
 *    update: [ { data: {name: 3}, where: {id: 2} } ],
 *    remove: [ {id: 3} ]
 * }
 */
export function prepareArrayField(
  value: any[],
  initial?: any[],
  mapper?: null | ((item: any, initial?: any) => any),
  { removedItemsMethod = "delete" }: Options = {}
) {
  value = value.filter(Boolean)

  const valueById = value.reduce((res, item) => {
    item.id && (res[item.id] = item)
    return res
  }, {})

  const initialById =
    initial?.reduce((res, item) => {
      item.id && (res[item.id] = item)
      return res
    }, {}) || {}

  const create: any[] = []
  const connect: any[] = []
  const update: any[] = []
  const remove = initial?.filter(({ id }) => !valueById[id])

  for (const item of value) {
    const { id } = item

    if (id) {
      if (initialById[id]) {
        if (!isEqual(item, initialById[id])) {
          update.push(item)
        }
      } else {
        connect.push(item)
      }
    } else {
      create.push(item)
    }
  }

  const connectItems = connect.map(({ id }) => ({ id }))

  const removeItems = remove?.map(({ id }) => ({ id }))

  const createItems = mapper ? create.map((item) => mapper(item)) : create

  const updateItems = update.map((item) => {
    const initialItemValue = initialById[item.id]

    const changed = Object.keys(item).reduce((acc: any, key) => {

      const value = item[key]

      if (!isEqual(value, initialItemValue && initialItemValue[key])) {
        acc[key] = value
      }

      return acc
    }, {})

    return {
      data: mapper ? mapper(changed, initialItemValue) : changed,
      where: { id: item.id },
    }
  })

  return {
    connect: connectItems.length ? connectItems : undefined,

    create: createItems.length ? createItems : undefined,

    update: updateItems?.length ? updateItems : undefined,

    [removedItemsMethod]: removeItems?.length ? removeItems : undefined,
  }
}
