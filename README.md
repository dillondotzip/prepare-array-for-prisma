# Prepare Array For Prisma
A utility that will take regular arrays from forms and adapt them to work with prisma. It also works with nested arrays.

## Get Started
`yarn add @creatorsneverdie/prepare-array-for-prisma`

`import {prepareArrayField} from "@creatorsneverdie/prepare-array-for-prisma"`

## How To
`prepareArrayField()` takes 3 parameters:
1. Form values
2. Initial database data
3. Mapper

You use the function like this:
```ts
const value = [ {name: 1}, {id: 2, name: 3} ]
const initial = [ {id: 2, name: 2}, {id: 3} ]

const mappedArray = prepareArrayField(value, initial, (item) => ({
  ...item,
}))
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

