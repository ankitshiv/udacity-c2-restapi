import { Router, Request, Response } from 'express';
import { FeedItem } from '../models/FeedItem';
import { requireAuth } from '../../users/routes/auth.router';
import * as AWS from '../../../../aws';
import rp = require('request-promise');

const router: Router = Router();
const imageFilterServiceUrl : string = 'http://localhost:8082'
// 'http://image-filter-starter-code-dev22222222.us-east-1.elasticbeanstalk.com';

// Get all feed items
router.get('/', async (req: Request, res: Response) => {
    const items = await FeedItem.findAndCountAll({order: [['id', 'DESC']]});
    items.rows.map((item) => {
            if(item.url) {
                item.url = AWS.getGetSignedUrl(item.url);
            }
    });
    res.send(items);
});

//@TODO
//Add an endpoint to GET a specific resource by Primary Key
router.get('/:id', async (req: Request, res: Response) => {
    let { id } = req.params;
    const item = await FeedItem.findByPk(id);
    if (!item) {
        res.status(404).send({message: "item for id=" + id + " not found"})
    }
    item.url = AWS.getGetSignedUrl(item.url);
    res.status(200).send(item);
});

// update a specific resource
router.patch('/:id', 
    requireAuth, 
    async (req: Request, res: Response) => {
        //@TODO try it yourself
        let caption = req.body.caption;
        let fileName = req.body.url;

        console.log("body =>", req.body);

        await FeedItem.update({
            caption,
            url: fileName
        },{ where: {id: req.params.id}
        }).then(([value, feedItem]) => {
            res.json({value, feedItem});
        }).catch((err) => {
            res.status(400).send({message: "bad request", err})
        });
});


router.get('/feed-image/:id', 
    async (req: Request, res: Response) => {

    // var imageUrl = req.query.imageUrl;
    // await rp(imageFilterServiceUrl + '/filteredimage?image_url=' + imageUrl)
    //     .then((image) => {
    //         res.sendFile(image);
    //     }).catch((e) => {
    //         res.status(500).send(e);
    //     })
    
    // DOES NOT WORK FOR UDASHIVHARE S3 BUCKET SIGNED IMAGE URLS AS IMAGES ARE NOT PUBLIC
    let { id } = req.params;
    console.log(id);
    const item = await FeedItem.findByPk(id);

    if (!item) {
        res.status(404).send({message: "item for id=" + id + " not found"})
    } else {
        item.url = await AWS.getGetSignedUrl(item.url);
        await rp(imageFilterServiceUrl + '/filteredimage?image_url=' + item.url)
        .then((image) => {
            res.sendFile(image);
        }).catch((e) => {
            res.status(500).send(e);
        });
    }
});


// Get a signed url to put a new item in the bucket
router.get('/signed-url/:fileName', 
    requireAuth, 
    async (req: Request, res: Response) => {
    let { fileName } = req.params;
    const url = AWS.getPutSignedUrl(fileName);
    res.status(201).send({url: url});
});

// Post meta data and the filename after a file is uploaded 
// NOTE the file name is they key name in the s3 bucket.
// body : {caption: string, fileName: string};
router.post('/', 
    requireAuth, 
    async (req: Request, res: Response) => {
    const caption = req.body.caption;
    const fileName = req.body.url;

    // check Caption is valid
    if (!caption) {
        return res.status(400).send({ message: 'Caption is required or malformed' });
    }

    // check Filename is valid
    if (!fileName) {
        return res.status(400).send({ message: 'File url is required' });
    }

    const item = await new FeedItem({
            caption: caption,
            url: fileName
    });

    const saved_item = await item.save();

    saved_item.url = AWS.getGetSignedUrl(saved_item.url);
    res.status(201).send(saved_item);
});

export const FeedRouter: Router = router;