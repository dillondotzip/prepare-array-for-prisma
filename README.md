# Prepare Array For Prisma
A utility that will take regular arrays from forms and adapt them to work with prisma. It also works with nested arrays.

## Get Started
`yarn add @creatorsneverdie/prepare-array-for-prisma`

`import {prepareArrayField} from "@creatorsneverdie/prepare-array-for-prisma"`

## How To
`prepareArrayField()` takes 4 parameters:
1. Form values as `any[]`
2. Initial database data as `any[]`
3. Mapper as `((item: any, initial?: any) => any)`
4. Options as `{ removedItemsMethod: 'disconnect' | 'delete'}`

You use the function like this:
```ts
const value = [ {name: 1}, {id: 2, name: 3} ]
const initial = [ {id: 2, name: 2}, {id: 3} ]

const mappedArray = prepareArrayField(value, initial, (item) => ({
  ...item,
}))
```

You can also set options object for handling removing elements. You can choose to either delete the element from the database completely, or disconnect. By default the option is set to  `disconnect`:

```ts
const mappedArray = prepareArrayField(value, initial, (item) => ({
  ...item,
}), {removedItemsMethod: "delete" })
```

Then inside a prisma operation:
```ts
  const updateUser = await prisma.project.update({
    where: {
      id: 1
    },
    data: {
      title: 'test project update',
      users: mappedArray
    }
  })
```

