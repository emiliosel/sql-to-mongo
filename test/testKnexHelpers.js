
const expect = require('chai').expect;
import { buildSelect } from '../src/helpers/knex'

describe('Check knex helpers', () => {

  it('should return correct select object to use with knex', () => {
    let columns = {
      key: {
        type: String,
        from: 'id'
      },
      name: {
        type: Object
      },
      surname: {
        from: 'last_name'
      }
    }

    let expectedObj = {
      key: 'id',
      name: 'name',
      surname: 'last_name'
    }
    expect(buildSelect(columns)).to.deep.equal(expectedObj)
  })
})
