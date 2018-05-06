
function Terrain ()
{
}

Terrain.prototype.create = function ( x, y )
{
	this.ground = Global.physics.createBody();
	this.groundFixtureDefinition = {density: 0.0, friction: 0.6}

	this.groundList = []

	this.addGround(197, 106);
};

Terrain.prototype.addGround = function(x, y)
{
	var points = [];
	points.push(Vec2(x, y));
	for (var i = 0; i < 100; ++i) {
		points.push(Vec2(
			points[i].x + Math.round(20 + 40*Math.random()),
			points[0].y + Math.round(20 - 40*Math.random())
		));
	}
	this.groundList.push(points);

	// Add ground points to physics
	for (var i = 0; i < points.length-1; ++i) {
		this.ground.createFixture(pl.Edge(
			points[i],
			points[i+1]
		), this.groundFixtureDefinition);
	}
};

Terrain.prototype.addHalfpipe = function(x, y)
{
	var s = 0.8;

	var points = [
		Vec2(0, 29),
		Vec2(12, 29),
		Vec2(24, 34),
		Vec2(26, 52),
		Vec2(27, 58),
		Vec2(28, 64),
		Vec2(32, 69),
		Vec2(35, 74),
		Vec2(39, 77),
		Vec2(43, 81),
		Vec2(48, 84),
		Vec2(53, 87),
		Vec2(58, 90),
		Vec2(63, 92),
		Vec2(69, 94),
		Vec2(74, 96),
		Vec2(81, 97),
		Vec2(88, 98),
	];
	for (var i = 0; i < points.length; i++) {
		points[i].x = x + s*points[i].x;
		points[i].y = y + s*points[i].y;
	}
	// Mirror
	for (var i = points.length - 1; i >= 0; i--) {
		points.push( Vec2(s*246 - points[i].x, points[i].y) );
	}
	this.groundList.push(points);

	// Add ground points to physics
	for (var i = 0; i < points.length-1; ++i) {
		this.ground.createFixture(pl.Edge(
			points[i],
			points[i+1]
		), this.groundFixtureDefinition);
	}
};

Terrain.prototype.update = function()
{
};

Terrain.prototype.render = function( graphics )
{
	// Draw ground
	graphics.lineStyle(1, 0x884400, 1.0);
	for (var j = 0; j < this.groundList.length; ++j) {
		var points = this.groundList[j];
		for (var i = 0; i < points.length-1; ++i) {
			graphics.moveTo(points[i].x, points[i].y);
			graphics.lineTo(points[i+1].x, points[i+1].y);
		}
	}
};