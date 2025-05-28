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

public partial class Player : Schema {
#if UNITY_5_3_OR_NEWER
[Preserve]
#endif
public Player() { }
	[Type(0, "string")]
	public string sessionId = default(string);

	[Type(1, "string")]
	public string name = default(string);

	[Type(2, "array", typeof(ArraySchema<string>), "string")]
	public ArraySchema<string> hand = null;

	[Type(3, "number")]
	public float chips = default(float);

	[Type(4, "number")]
	public float currentBet = default(float);

	[Type(5, "boolean")]
	public bool isFolded = default(bool);
}

