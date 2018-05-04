
var Global = Global || {};

Global.Game = function()
{
};

Global.Game.prototype.create = function ()
{
	Global.game.stage.backgroundColor = '#eeeeee';
};

Global.Game.prototype.preRender = function ()
{
};

Global.Game.prototype.update = function ()
{
	this.handleCollisions();
};

Global.Game.prototype.handleCollisions = function ()
{
};

Global.Game.prototype.render = function ()
{
};
