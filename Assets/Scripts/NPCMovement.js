#pragma strict

private var stats : Stats;
private var charController : CharacterController;
private var face : FaceDirection;
// Target position
var target : Vector3 = Vector3.zero;
// Denotes whether or not gameobject should move towards target, since target (Vector3) can't be null
var hasTarget : boolean = false;


// Grab the necessary components (stats, controller, face)
function Start () {
	stats = gameObject.GetComponent(Stats);
	charController = gameObject.GetComponent(CharacterController);
	face = gameObject.GetComponent(FaceDirection);
}

// Sets the target, keeping the z at 0
function setTarget(newTarget : Vector3) {
	target = newTarget;
	target.z = 0;
	hasTarget = true;
}

function getHasTarget() {
	return hasTarget;
}

function clearTarget() {
	hasTarget = false;
}

function Update () {
	if(stats.onFire()){
		gameObject.renderer.material.color = Color.red;
		stats.hurtHealth(1);
		if(stats.getHealth() <= 0)
			gameObject.renderer.material.color = Color.black;
		
		//Run Away
		var HeroVector = (GameObject.Find("Sidekick").transform.position - gameObject.transform.position);
		var angle = Mathf.Atan(HeroVector.y / HeroVector.x) + Mathf.PI;
		if(HeroVector.x < 0)
			angle = angle + Mathf.PI;
		angle = angle + (Random.value - 0.5) * Mathf.PI;
		target = gameObject.transform.position + Vector3(Mathf.Cos(angle) * 2, Mathf.Sin(angle) * 2, 0);
		hasTarget = true;
		
		
	}
	else
		gameObject.renderer.material.color = Color.white;
	
	if(hasTarget) {
		var move : Vector3;
		move = Vector3.MoveTowards(transform.position, target, stats.getMoveSpeed() * Time.deltaTime) - transform.position;
		// Moves the object while detecting collisions
		charController.Move(move);
		// Informs the face of the move
		face.moved(move);
		
		// Arrived at target position
		if (transform.position == target) {
			hasTarget = false;
		}
	}
}