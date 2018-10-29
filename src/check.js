const Migration = require('./module')
// const Migration = require('./module')
const mongoose = require('mongoose')
const sql = {
    client: 'mysql',
    connection: {
        host: 'localhost',
        port: '8889',
        user: 'root',
        password: '123',
        database: 'newpost_v2db'
    }
}

const mongo = {
    host: 'localhost',
    port: '27017',
    database: 'maritime_cms'
}

const tagsOptions = {
  fromTable: 'tags',
  toCollection: 'tags',
  paginate: 1000,
  limit: 1000,
  columns: {
      oldId: {
          type: String,
          from: 'id'
      },
      lang: {
          type: {
              type: String,
              default: 'en'
          },
          custom: true
      },
      tagId: {
          type: {
            type: mongoose.Types.ObjectId
          },
          custom: true,
          beforeSave: async (doc, mongoose) => {
            doc['tagId'] = doc._id
          }
      },
      name: {
          type: String,
          from: 'title'
      },
      timestamp: {
        type: String
      }
  }
}

const categoriesOptions = {
    fromTable: 'categories',
    toCollection: 'category',
    paginate: 1000,
    limit: 1000,
    columns: {
        oldId: {
            type: String,
            from: 'id'
        },
        lang: {
            type: {
                type: String,
                default: 'en'
            },
            custom: true
        },
        categoryId: {
            type: {
                type: mongoose.Types.ObjectId,
                default: mongoose.Types.ObjectId()
            },
            custom: true,
            beforeSave: async (doc, mongoose) => {
                doc.categoryId = doc._id
            }
        },
        name: {
            type: String,
            from: 'title'
        },
        slug: {
            type: String
        }
    }
}

const options = {
    fromTable: 'articles',
    toCollection: 'post',
    limit: 1000,
    paginate: 100,
    columns: {
        oldId: {
            type: String,
            from: 'id'
        },
        lang: {
            type: {
                type: String,
                default: 'en'
            },
            custom: true
        },
        postId: {
            type: {
                type: mongoose.Types.ObjectId,
                default: mongoose.Types.ObjectId()
            },
            custom: true,
            beforeSave: async (doc, mongoose) => {
                doc.postId = doc._id
            }
        },
        categories: {
            type: [String],
            custom: true,
            beforeSave: async (doc, mongoose) => {
                let categoriesModel = mongoose.connection.models['category']
                let category = await categoriesModel.findOne({oldId: doc.category_id})
                doc['categories'] = [category._id]
                delete category
                delete categoriesModel
            }
        },
        category_id: {
            type: Number
        },
        image_id: {
            type: Number
        },
        image_inside_id: {
            type: Number
        },
        video_player_id: {
            type: Number
        },
        author_id: {
            type: Number
        },
        itemDate: {
            type: String,
            from: 'date'
        },
        hits: {
            type: Number
        },
        slug: {
            type: String
        },
        subTitle: {
            type: String,
            from: 'title'
        },
        name: {
            type: String,
            from: 'supertitle'
        },
        description: {
            type: String
        },
        smallDescription: {
            type: String,
            from: 'text'
        },
        source: {
            type: String
        },
        source_url: {
            type: String
        },
        videoUrl: {
            type: String,
            from: 'video_url'
        },
        videoEmbed: {
            type: String,
            from: 'video_code'
        },
        gallery_images: {
            type: String
        },
        redirectUrl: {
            type: String,
            from: 'redirect_url'
        },
        metaTitle: {
            type: String,
            from: 'meta_title'
        },
        metaDescription: {
            type: String,
            from: 'meta_description'
        },
        user_id: {
            type: Number
        },
        user_id_edit: {
            type: Number
        },
        created: {
            type: Date,
            from: 'timestamp'
        },
        lastUpdated: {
            type: Date,
            from: 'timestamp_edit'
        },
        show_image: {
            type: Boolean
        },
        show_timestamp_edit: {
            type: Boolean
        },
        noindex: {
            type: Boolean
        },
        nofollow: {
            type: Boolean
        },
        social: {
            type: Boolean
        },
        timeActive: {
            type: Boolean,
            from: 'schedule_activation'
        },
        active: {
            type: Boolean
        },
        type: {
            type: String
        },
        label: {
            type: String
        },
        has_gallery: {
            type: Boolean
        },
        has_video: {
            type: Boolean
        },
        long_article: {
            type: Boolean
        },
        home_tracking_code: {
            type: String
        },
        tracking_code: {
            type: String
        },
        is_facebook_instant_article: {
            type: Boolean
        },
        oldName: {
            type: String,
            from: 'name'
        }
    }
}

let migration = new Migration({
    sql,
    mongo
})

// console.log({mig: migration.down(categoriesOptions).then()})

// migration.down(categoriesOptions)
// .then((migrationObj) => {
//     console.log({migrationObj})
//     // migrationObj = await migrationObj.up()
//     return migrationObj
// })
// .up()
// .then((migrationObj) => {
//     migrationObj =  await migrationObj.down(options)
//     return migrationObj
// })
// // .down(options)
// .then((migrationObj) => {
//      migrationObj = await migrationObj.up()
//     return migrationObj
// })
// // .up()
// .then(() => {
//     console.log('!!DONE ALL!!')
// })

// migration.down(categoriesOptions).then(() => {
//     migration.up(categoriesOptions).then(() => {
//         console.log('!!DONE!!')
//     })
// })

// migration.down(options).then(() => {
//     migration.up(options).then(() => {
//         console.log('!!DONE!!')
//     })
// })

async function runMigrations() {
    await migration.down(categoriesOptions)
    await migration.down(tagsOptions)
    migration.up(categoriesOptions)
    migration.up(tagsOptions)
    // await migration.down(options)
    // await migration.up(options)
}

runMigrations().then(() => {
    console.log('!!DONE!!')
})
