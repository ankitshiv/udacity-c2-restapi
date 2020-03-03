import { Router, Request, Response } from 'express';

// import { User } from '../models/User';
import { requireAuth } from '../../users/routes/auth.router';
import rp = require('request-promise');

const imageFilterServiceUrl : string = 'http://image-filter-starter-code-dev22222222.us-east-1.elasticbeanstalk.com'; // 'http://localhost:8082'


const router: Router = Router();

// endpoint to serve image using a public image url;
// issue - does not serve image but buffer file - TODO - convert buffer output to image
router.get('/', async (req: Request, res: Response) => {
    var imageUrl = req.query.imageUrl;
    await rp(imageFilterServiceUrl + '/filteredimage?image_url=' + imageUrl)
        .then((image) => {
            res.sendFile(image);
        }).catch((e) => {
            res.status(500).send(e);
        })
});

    

export const filteredImageRouter: Router = router;