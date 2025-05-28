// 
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
// 
// GENERATED USING @colyseus/schema 3.0.37
// 

using Colyseus.Schema;
#if UNITY_5_3_OR_NEWER
using UnityEngine.Scripting;
#endif

public partial class MyRoomState : Schema {
#if UNITY_5_3_OR_NEWER
[Preserve]
#endif
public MyRoomState() { }
	[Type(0, "map", typeof(MapSchema<Player>))]
	public MapSchema<Player> players = null;

	[Type(1, "array", typeof(ArraySchema<string>), "string")]
	public ArraySchema<string> deck = null;

	[Type(2, "array", typeof(ArraySchema<string>), "string")]
	public ArraySchema<string> communityCards = null;

	[Type(3, "number")]
	public float pot = default(float);

	[Type(4, "number")]
	public float currentBet = default(float);

	[Type(5, "string")]
	public string currentTurn = default(string);

	[Type(6, "boolean")]
	public bool roundStarted = default(bool);

	[Type(7, "string")]
	public string phase = default(string);

	[Type(8, "string")]
	public string lastRaiser = default(string);
}

