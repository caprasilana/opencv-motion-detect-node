// called when the runtime loads the node on startup
module.exports = function (RED) {

	// called whenever a new instance of the node is created
	// the 'config' argument contains node specific properties set in the editor
	function OpencvMotionDetectNode(config) {
		RED.nodes.createNode(this, config);

		// set properties
		// this.imagePath = config.imagePath;
		this.vid = null;
		this.timings = {};

		const node = this
		const cv = require('opencv');


		if (cv === null) {
			this.warn('node-opencv not found');
			this.status({ fill: "red", shape: "ring", text: "node-opencv not found" });
			return;
		}

		// register a listener to the 'input' event
		// which gets called whenever a message arrives at the node
		node.on('input', function (msg, send, done) {

			// For maximum backwards compatibility, check that send exists.
			// If this node is installed in Node-RED 0.x, it will need to
			// fallback to using `node.send`
			send = send || function () { node.send.apply(node, arguments) }

			var cvdesc = Object.keys(cv);
			this.log("cvdesc: " + cvdesc);
			node.send([null, { payload: cvdesc }]);
			// flow.set('cv', cv);

			node.send({ payload: 1 });
			node.send({ payload: 'next' });

			// Stop streaming Flow 
			// if (msg.payload === 0) {
			// 	var vid = flow.get('cvvid');
			// 	if (node.vid) {
			// 		node.warn(util.inspect(node.vid));
			// 		node.vid.release();
			// 		node.vid= null;
			// 	}
			// }


			// Start streaming flow
			if (!node.vid) {
				try {
					flow.set('start', null);
					flow.set('count', null);
					flow.set('last_s', null);

					ndoe.timings.startup = {};
					ndoe.timings.startup.start = Date.now();
					node.vid = new cv.VideoCapture(0);
					ndoe.timings.startup.end = Date.now();
					ndoe.timings.startup.diff = ndoe.timings.startup.end - ndoe.timings.startup.start;

					node.warn(node.vid);

				} catch (e) {
					node.warn(e);
				}
			}

			// if (msg.payload === 'ack') {
			// 	var timings = flow.get('timings');
			// 	timings.imagecidiff = context.imageci - msg.imageci;
			// 	return;
			// }


			if (node.vid) {
				try {
					//node.vid.grab(function(err, im)
					{

						lasttime = 0;
						if (ndoe.timings.readframe) {
							lasttime = ndoe.timings.readframe.start;
						}

						ndoe.timings.readframe = {};
						ndoe.timings.readframe.start = Date.now();
						ndoe.timings.readframe.overall = ndoe.timings.readframe.start - lasttime;

						node.vid.read(function (err, im) {
							try {
								//node.warn("read " + util.inspect(err) + " "+util.inspect(im));
								if (err) return;
								//im = im[0];
								//node.warn(util.inspect(im));
								//if (im.size()[0] > 0 && im.size()[1] > 0)
								{
									ndoe.timings.readframe.end = Date.now();
									ndoe.timings.readframe.diff = timings.readframe.end - timings.readframe.start;

									msg.img = im;
									msg.imdesc = util.inspect(im);
									msg.timestamp = Date.now();

									context.imageci = context.imageci || 0;
									msg.imageci = context.imageci++;

									node.send(msg);
								}
							} catch (e) {
								node.warn(e);
							}
						});

					}


				} catch (e) {
					node.warn(e);
				}
			}


			if (done) {
				done();
			}

		});

		node.on('close', function () {
		})
	}
	RED.nodes.registerType("opencv-motion-detect-node", OpencvMotionDetectNode);
}