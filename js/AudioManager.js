
// Constructor
function AudioManager()
{
	this.sounds = {};

	this.init();
};

AudioManager.prototype.init = function ()
{
	//addMarker(name, start, duration, volume, loop)

	var masterVol = 1.0;

	//var name = 'music';
	//var vol = 0.5 * masterVol;
	//this.sounds[name] = {};
	//this.sounds[name].sound = Global.game.add.audio( name, vol );
};

AudioManager.prototype.getMarkers = function ( name, marker=null )
{
	if ( marker )
		return this.sounds[name].markers[marker];
	else
		return this.sounds[name].markers;
};

AudioManager.prototype.play = function ( name, marker=null )
{
	var markers = this.getMarkers( name, marker );
	if ( markers )
	{
		do
		{
			var index = markers.choice();
		}
		while (
			this.sounds[name].lastPlayed == index && markers.length > 1 );

		this.sounds[name].lastPlayed = index;
		this.sounds[name].sound.play( index );
	}
	else
	{
		this.sounds[name].sound.play();
	}
};

AudioManager.prototype.loop = function ( name, marker=null )
{
	var markers = this.getMarkers( name, marker );
	if ( markers )
	{
		do
		{
			var index = markers.choice();
		}
		while (
			this.sounds[name].lastPlayed == index && markers.length > 1 );

		this.sounds[name].lastPlayed = index;
		this.sounds[name].sound.loopFull( index );
	}
	else
	{
		this.sounds[name].sound.loopFull();
	}
};
