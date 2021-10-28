'use strict';

const jwt = require('jsonwebtoken');

class DataCollection {
  constructor(model) {
    this.model = model;
  }

  get(id) {
    if (id) {
      return this.model.findOne({ id });
    }
    else {
      return this.model.findAll({});
    }
  }

  create(record) {
    return this.model.create(record);
  }

  update(id, data, author) {
    
    return this.model.findOne({ where: { id } })
      .then(record => {
        record.update(data);
        record.author = author;
        return record;
      }
    ); 
  }

  delete(id) {
    return this.model.destroy({ where: { id }});
  }
}

module.exports = DataCollection;
