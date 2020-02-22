// called when the runtime loads the node on startup
module.exports = function (RED) {

	// called whenever a new instance of the node is created
	// the 'config' argument contains node specific properties set in the editor
	function OpencvMotionDetectNode(config) {
		RED.nodes.createNode(this, config);

		// set properties
		this.imagePath = config.imagePath;
		this.width = config.width;
		this.height = config.height;
		this.offset_x = config.offset_x;
		this.offset_y = config.offset_y;
		this.title = config.title;

		const node = this
		const lineWidth = 3;
		const font = '30px Impact';
		const { createCanvas, loadImage } = require('canvas');

		// register a listener to the 'input' event
		// which gets called whenever a message arrives at the node
		node.on('input', function (msg, send, done) {

			// For maximum backwards compatibility, check that send exists.
			// If this node is installed in Node-RED 0.x, it will need to
			// fallback to using `node.send`
			send = send || function () { node.send.apply(node, arguments) }


			msg.payload = "result";
			send(msg);

			if (done) {
				done();
			}

		});

		node.on('close', function () {
		})
	}
	RED.nodes.registerType("opencv-motion-detect-node", OpencvMotionDetectNode);
}