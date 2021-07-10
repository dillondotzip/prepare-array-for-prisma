import { prepareArrayField } from "../src";


describe('convert regular array for prisma', () => {
  it('updates successfuly', () => {
    const value = [ {name: 1}, {id: 2, name: 3} ]
    const initial = [ {id: 2, name: 2}, {id: 3} ]
    const mappedAssets = prepareArrayField(value, initial, (item) => ({
      ...item,
    }))

    expect(mappedAssets).toEqual(
      {
        connect: undefined,
        create: [ {name: 1} ],
        update: [ { data: {name: 3}, where: {id: 2} } ],
        delete: [ {id: 3} ]
      }
    );
  });
});