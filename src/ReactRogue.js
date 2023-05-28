import React,{useRef, useEffect, useState}  from "react";
import InputManager from "./InputManager";
import Player from "./Player";
import World from "./World";
import Spawner from "./Spawner";

const ReactRogue = ({ width, height, tileSize }) => {
    const canvasRef = React.useRef();

    //returns player state and method to update player
   // const [player, setPlayer] = useState(new Player(1, 2, tileSize));

    const [world, setWorld] = useState(new World(width, height, tileSize));
    // const world = new World(width, height, tileSize);

    let inputManager = new InputManager();

    const handleInput = (action, data) => {
        console.log(`handle input: ${action}:${JSON.stringify(data)}`);
        let newWorld = new World();
        Object.assign(newWorld, world);
        newWorld.movePlayer(data.x, data.y);
        setWorld(newWorld);
    };

    useEffect(()=>{
        console.log("create map!");
        let newWorld = new World();
        Object.assign(newWorld, world);
        newWorld.createCellularMap();
        newWorld.moveToSpace(world.player);
        let spawner = new Spawner(newWorld);
        spawner.spawnLoot(10);
        spawner.spawnMonster(6);
        spawner.spawnStairs();
        setWorld(newWorld);
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        console.log("Bind input ");
        inputManager.bindKeys();
        inputManager.subscribe(handleInput);
        return () => {
            inputManager.unbindKeys();
            inputManager.unsubscribe(handleInput);
        }
    });

    //drawing the player
    useEffect(() => {
        console.log("Draw to Canvas");
        const ctx = canvasRef.current.getContext('2d');
        ctx.clearRect(0, 0, width * tileSize, height * tileSize);
        world.draw(ctx);
    });

    return (
        <>
        <canvas 
            ref = {canvasRef}
            width = {width * tileSize} 
            height = {height * tileSize} 
            style = {{border: '1px solid black', background: 'grey' }} 
        ></canvas>
        <ul>
            {
            world.player.inventory.map((item, index) => (
                
                <li key={index}>{item.attributes.name}</li>
            ))}
        </ul>
        <ul>
            {
            world.history.map((item, index) => (   
                <li key={index}>{item}</li>
            ))}
        </ul>
            
        </>
    )
};

export default ReactRogue; 