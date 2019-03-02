const express = require('express');
const path = require('path');
const xss = require('xss');
const NotefulServices = require('./noteful-service');

const folderRouter = express.Router();

const jsonParser = express.json();

const serializeFolder = folder => ({
    id: folder.id,
    folder_name: xss(folder.folder_name)
});

folderRouter.route('/')
  .get((req, res, next)=>{
      const knexInstance = req.app.get('db');
      NotefulServices.getAll(knexInstance, "noteful_folders")
      .then(folders => res.json(folders.map(serializeFolder)))
      .catch(next);
  })
  .post(jsonParser, (req, res, next)=>{
      const { folder_name } =req.body;
      const newFolder = { folder_name };
  
      if (newFolder.folder_name == null){
        return res.status(400).json({
          error: { message: `Must provide folder name in request body` }
        })
      }
      NotefulServices.insert(
          req.app.get('db'), 
          newFolder, 
          "noteful_folders"
          )
        .then(folders => {
            res.status(201)
            .location(`/${folders.id}`)
            // .location(path.posix.join(res.originalUrl,`${}` ))
            .json(serializeFolder(folders))
        }).catch(next);
  })

  folderRouter
    .route('/:folderId')
    .all((req, res, next) => {
      NotefulServices
        .getById(
          req.app.get('db'), 
          req.params.folderId,
          "noteful_folders"
          )
          .then(folder => {
            if(!folder) {
              return res.status(404).json({
                error: {message: 'Folder does not exist'}
              })
            }
            res.folder = folder;
            next();
          })
    })
    .get((req, res, next) => {
      res.json(serializeFolder(res.folder));
    })
    .delete((req, res, next) => {
      NotefulServices.delete(
        req.app.get('db'),
        req.params.folderId,
        "noteful_folders"
      )
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
    })
    .patch(jsonParser, (req, res, next) => {
      const { folder_name } = req.body;
      const updatedFolder = { folder_name };

      if(updatedFolder.folder_name == null){
        return res.status(400).json({
          error: { message: `Must provide folder name in request body` }
        });
      }

      NotefulServices.update(
        req.app.get('db'),
        req.params.folderId,
        updatedFolder,
        "noteful_folders"
      )
      .then(() => {
        res.status(204).end()
      })
      .catch(next)
    })


  module.exports = folderRouter;