declare global{export enum ConfigType{Number="number",String="string",Color="color",Direction="direction",Orientation="orientation",Grid="grid",Icon="icon"}export interface Config<T>{readonly type:ConfigType;readonly field:string;readonly description:string;readonly default:T;readonly configurable:boolean;}export interface NumberConfig extends Config<number>{readonly type:ConfigType.Number;readonly min?:number;readonly max?:number;}export interface StringConfig extends Config<string>{readonly type:ConfigType.String;readonly maxLength?:number;}export interface ColorConfig extends Config<Color>{readonly type:ConfigType.Color;readonly allowGray:boolean;}export interface DirectionConfig extends Config<Direction>{readonly type:ConfigType.Direction;}export interface OrientationConfig extends Config<Orientation>{readonly type:ConfigType.Orientation;}export interface GridConfig extends Config<GridData>{readonly type:ConfigType.Grid;}export interface IconConfig extends Config<string>{readonly type:ConfigType.Icon;}export type AnyConfig=NumberConfig|StringConfig|ColorConfig|DirectionConfig|OrientationConfig|GridConfig|IconConfig;/**
 * Compare two config values for equality, using an appropriate method for the config type.
 *
 * @param type The type of the config.
 * @param a The first value to compare.
 * @param b The second value to compare.
 * @returns Whether the two values are equal.
 */export function configEquals<C extends AnyConfig>(type:C['type'],a:C['default'],b:C['default']):boolean;export class GridData{readonly width:number;readonly height:number;readonly tiles:readonly(readonly TileData[])[];readonly connections:GridConnections;readonly symbols:ReadonlyMap<string,readonly Symbol[]>;readonly rules:readonly Rule[];/**
 * Create a new grid with tiles, connections, symbols and rules.
 * @param width The width of the grid.
 * @param height The height of the grid.
 * @param tiles The tiles of the grid.
 * @param connections The connections of the grid, which determines which tiles are merged.
 * @param symbols The symbols in the grid.
 * @param rules The rules of the grid.
 */constructor(width:number,height:number,tiles?:readonly(readonly TileData[])[],connections?:GridConnections,symbols?:ReadonlyMap<string,readonly Symbol[]>,rules?:readonly Rule[]);/**
 * Copy the current grid while modifying the provided properties.
 * @param param0 The properties to modify.
 * @returns The new grid with the modified properties.
 */
copyWith({width,height,tiles,connections,symbols,rules,}:{width?:number;height?:number;tiles?:readonly(readonly TileData[])[];connections?:GridConnections;symbols?:ReadonlyMap<string,readonly Symbol[]>;rules?:readonly Rule[];}):GridData;isPositionValid(x:number,y:number):boolean;/**
 * Safely get the tile at the given position.
 * @param x The x-coordinate of the tile.
 * @param y The y-coordinate of the tile.
 * @returns The tile at the given position, or a non-existent tile if the position is invalid.
 */
getTile(x:number,y:number):TileData;/**
 * Safely set the tile at the given position.
 * If the position is invalid, the grid is returned unchanged.
 * If the tile is merged with other tiles, the colors of all connected tiles are changed.
 *
 * @param x The x-coordinate of the tile.
 * @param y The y-coordinate of the tile.
 * @param tile The new tile to set.
 * @returns The new grid with the tile set at the given position.
 */
setTile(x:number,y:number,tile:TileData|((tile:TileData)=>TileData)):GridData;/**
 * Replace or modify all tiles in the grid.
 *
 * @param tiles The new tile array or a function to mutate the existing tile array.
 * @returns The new grid with the new tiles.
 */
withTiles(tiles:readonly(readonly TileData[])[]|((value:TileData[][])=>readonly(readonly TileData[])[])):GridData;/**
 * Add or modify the connections in the grid.
 * @param connections The new connections to add or modify.
 * @returns The new grid with the new connections.
 */
withConnections(connections:GridConnections|((value:GridConnections)=>GridConnections)):GridData;/**
 * Add or modify the symbols in the grid.
 * @param symbols The new symbols to add or modify.
 * @returns The new grid with the new symbols.
 */
withSymbols(symbols:readonly Symbol[]|ReadonlyMap<string,readonly Symbol[]>|((value:Map<string,readonly Symbol[]>)=>ReadonlyMap<string,readonly Symbol[]>)):GridData;/**
 * Add a new symbol to the grid.
 * @param symbol The symbol to add.
 * @returns The new grid with the new symbol.
 */
addSymbol(symbol:Symbol):GridData;/**
 * Remove an instance of the symbol from the grid.
 * @param symbol The symbol to remove.
 * @returns The new grid with the symbol removed.
 */
removeSymbol(symbol:Symbol):GridData;/**
 * Add or modify the rules in the grid.
 * @param rules The new rules to add or modify.
 * @returns The new grid with the new rules.
 */
withRules(rules:readonly Rule[]|((value:readonly Rule[])=>readonly Rule[])):GridData;/**
 * Add a new rule to the grid.
 * @param rule The rule to add.
 * @returns The new grid with the new rule.
 */
addRule(rule:Rule):GridData;/**
 * Remove an instance of the rule from the grid.
 * @param rule The rule to remove.
 * @returns The new grid with the rule removed.
 */
removeRule(rule:Rule):GridData;/**
 * Replace an existing rule with a new rule.
 * @param oldRule The rule to replace.
 * @param newRule The new rule to replace with.
 * @returns The new grid with the rule replaced.
 */
replaceRule(oldRule:Rule,newRule:Rule):GridData;/**
 * Resize the grid to the new width and height. Common tiles are kept, and new tiles are empty.
 * @param width The new width of the grid.
 * @param height The new height of the grid.
 * @returns The new grid with the new dimensions.
 */
resize(width:number,height:number):GridData;/**
 * Create a new mutable TileData array from a string array.
 *
 * - Use `b` for dark cells, `w` for light cells, and `n` for gray cells.
 * - Capitalize the letter to make the tile fixed.
 * - Use `.` to represent empty space.
 *
 * @param array - The string array to create the tiles from.
 * @returns The created tile array.
 */static createTiles(array:string[]):TileData[][];/**
 * Create a new GridData object from a string array.
 *
 * - Use `b` for dark cells, `w` for light cells, and `n` for gray cells.
 * - Capitalize the letter to make the tile fixed.
 * - Use `.` to represent empty space.
 *
 * @param array - The string array to create the grid from.
 * @returns The created grid.
 */static create(array:string[]):GridData;/**
 * Find a tile in the grid that satisfies the predicate.
 *
 * @param predicate The predicate to test each tile with.
 * @returns The position of the first tile that satisfies the predicate, or undefined if no tile is found.
 */
find(predicate:(tile:TileData,x:number,y:number)=>boolean):Position|undefined;/**
 * Iterate over all tiles in the same region as the given position that satisfy the predicate.
 * The iteration stops when the callback returns a value that is not undefined.
 * Non-existent tiles are not included in the iteration.
 *
 * @param position The position to start the iteration from. This position is included in the iteration.
 * @param predicate The predicate to test each tile with. The callback is only called for tiles that satisfy this predicate.
 * @param callback The callback to call for each tile that satisfies the predicate. The iteration stops when this callback returns a value that is not undefined.
 * @returns The value returned by the callback that stopped the iteration, or undefined if the iteration completed.
 */
iterateArea<T>(position:Position,predicate:(tile:TileData)=>boolean,callback:(tile:TileData,x:number,y:number)=>undefined|T):T|undefined;/**
 * Iterate over all tiles in a straight line from the given position in the given direction that satisfy the predicate.
 * The iteration stops when the callback returns a value that is not undefined.
 * Non-existent tiles break the iteration.
 *
 * @param position The position to start the iteration from. This position is included in the iteration.
 * @param direction The direction to iterate in.
 * @param predicate The predicate to test each tile with. The callback is only called for tiles that satisfy this predicate.
 * @param callback The callback to call for each tile that satisfies the predicate. The iteration stops when this callback returns a value that is not undefined.
 * @returns The value returned by the callback that stopped the iteration, or undefined if the iteration completed.
 */
iterateDirection<T>(position:Position,direction:Direction,predicate:(tile:TileData)=>boolean,callback:(tile:TileData,x:number,y:number)=>T|undefined):T|undefined;/**
 * Iterate over all tiles in a straight line from the given position in the given direction that satisfy the predicate.
 * The iteration stops when the callback returns a value that is not undefined.
 * Non-existent tiles are included in the iteration.
 *
 * @param position The position to start the iteration from. This position is included in the iteration.
 * @param direction The direction to iterate in.
 * @param predicate The predicate to test each tile with. The callback is only called for tiles that satisfy this predicate.
 * @param callback The callback to call for each tile that satisfies the predicate. The iteration stops when this callback returns a value that is not undefined.
 * @returns The value returned by the callback that stopped the iteration, or undefined if the iteration completed.
 */
iterateDirectionAll<T>(position:Position,direction:Direction,predicate:(tile:TileData)=>boolean,callback:(tile:TileData,x:number,y:number)=>T|undefined):T|undefined;/**
 * Check if every tile in the grid is filled with a color other than gray.
 *
 * @returns True if every tile is filled with a color other than gray, false otherwise.
 */
isComplete():boolean;/**
 * Iterate over all tiles in the grid.
 * The iteration stops when the callback returns a value that is not undefined.
 *
 * @param callback The callback to call for each tile.
 * @returns The value returned by the callback that stopped the iteration, or undefined if the iteration completed.
 */
forEach<T>(callback:(tile:TileData,x:number,y:number)=>T|undefined):T|undefined;/**
 * Flood fill a continuous region starting from the given position with the given color.
 *
 * @param position The position to start the flood fill from.
 * @param from The color of the tiles to fill.
 * @param to The color to fill the tiles with.
 * @returns The new grid with the region filled with the new color.
 */
floodFill(position:Position,from:Color,to:Color):GridData;/**
 * Flood fill all tiles with the given color to a new color, even if they are not connected.
 *
 * @param from The color of the tiles to fill.
 * @param to The color to fill the tiles with.
 * @returns The new grid with all tiles filled with the new color.
 */
floodFillAll(from:Color,to:Color):GridData;/**
 * Reset all non-fixed tiles to gray.
 *
 * @returns The new grid with all non-fixed tiles reset to gray.
 */
resetTiles():GridData;/**
 * Copy the tiles in the given region to a new grid.
 * All connections and symbols within the selected region are copied.
 * All rules are included as well.
 *
 * @param origin The top-left corner of the region to copy.
 * @param width The width of the region to copy.
 * @param height The height of the region to copy.
 * @returns The new grid with the copied tiles.
 */
copyTiles(origin:Position,width:number,height:number):GridData;/**
 * Paste the tiles from the given grid to the current grid at the given position.
 * All connections, symbols, and rules are merged.
 *
 * @param origin The top-left corner of the region to paste the tiles to.
 * @param grid The grid to paste the tiles from.
 * @returns The new grid with the pasted tiles.
 */
pasteTiles(origin:Position,grid:GridData):GridData;/**
 * Paste the tiles from the given array to the current grid at the given position.
 *
 * @param origin The top-left corner of the region to paste the tiles to.
 * @param tile The array of tiles to paste.
 * @returns The new grid with the pasted tiles.
 */
pasteTiles(origin:Position,tile:readonly(readonly TileData[])[]):GridData;/**
 * Check if this grid is equal to another grid in terms of size and tile colors.
 * Rules, symbols, and connections are not compared.
 *
 * @param grid The grid to compare with.
 * @returns True if the grids are equal in size and tile colors, false otherwise.
 */
colorEquals(grid:GridData):boolean;/**
 * Check if this grid is equal to another grid in terms of size, tile colors, connections, symbols, and rules.
 *
 * @param other The grid to compare with.
 * @returns True if the grids are equal, false otherwise.
 */
equals(other:GridData):boolean;/**
 * Deduplicate the rules in the given list.
 *
 * @param rules The list of rules to deduplicate.
 * @returns The deduplicated list of rules.
 */static deduplicateRules(rules:readonly Rule[]):readonly Rule[];/**
 * Deduplicate the symbols in the given map.
 *
 * @param symbols The map of symbols to deduplicate.
 * @returns The deduplicated map of symbols.
 */static deduplicateSymbols(symbols:ReadonlyMap<string,readonly Symbol[]>):ReadonlyMap<string,readonly Symbol[]>;}export interface Position{readonly x:number;readonly y:number;}export interface Edge{readonly x1:number;readonly y1:number;readonly x2:number;readonly y2:number;}export enum State{Error="error",Satisfied="satisfied",Incomplete="incomplete"}export type RuleState={readonly state:State.Error;readonly positions:readonly Position[];}|{readonly state:State.Satisfied;}|{readonly state:State.Incomplete;};export interface GridState{final:State;rules:readonly RuleState[];symbols:ReadonlyMap<string,State[]>;}export enum Color{Dark="dark",Light="light",Gray="gray"}export enum Direction{Up="up",Down="down",Left="left",Right="right"}export const DIRECTIONS:readonly Direction[];export enum Orientation{Up="up",UpRight="up-right",Right="right",DownRight="down-right",Down="down",DownLeft="down-left",Left="left",UpLeft="up-left"}export const ORIENTATIONS:readonly Orientation[];export enum Mode{Create="create",Solve="solve"}export class GridConnections{readonly edges:readonly Edge[];constructor(edges?:readonly Edge[]);addEdge(edge:Edge):GridConnections;removeEdge(edge:Edge):GridConnections;isConnected(edge:Edge):boolean;getConnectionsAt({x,y}:Position):readonly Edge[];getForTile({x,y}:Position):TileConnections;getConnectedTiles({x,y}:Position):readonly Position[];/**
 * Create new GridConnections from a string array.
 *
 * - Use `.` for cells that don't connect to anything.
 * - Use any other character for cells that connect to the same character.
 *
 * @param array - The string array to create the connections from.
 * @returns The created connections. You can apply this to a GridData object using GridData.withConnections.
 */static create(array:string[]):GridConnections;/**
 * Check if two GridConnections objects are equal.
 * @param other The other GridConnections object to compare to.
 * @returns Whether the two objects are equal.
 */
equals(other:GridConnections):boolean;/**
 * Deduplicate an array of edges.
 * @param edges The array of edges to deduplicate.
 * @returns The deduplicated array of edges.
 */static deduplicateEdges(edges:readonly Edge[]):readonly Edge[];}export interface SearchVariant{description:string;rule:Rule;}export abstract class Rule extends Instruction{abstract validateGrid(grid:GridData):RuleState;statusText(_grid:GridData,_solution:GridData|null,_state:GridState):string|null;abstract get searchVariants():SearchVariant[];searchVariant():SearchVariant;/**
 * Allows this rule to override the validation of symbols.
 *
 * You can return a different validation result, or call the original validation logic with a modified grid.
 *
 * @param grid - The grid to validate.
 * @param _symbol - The symbol to validate.
 * @param validator - The original validation logic for the symbol.
 * @returns The state of the symbol after validation.
 */
overrideSymbolValidation(_grid:GridData,_symbol:Symbol,_validator:(grid:GridData)=>State):State|undefined;}export abstract class Symbol extends Instruction{readonly x:number;readonly y:number;constructor(x:number,y:number);abstract validateSymbol(grid:GridData):State;withX(x:number):this;withY(y:number):this;withPosition(x:number,y:number):this;}export class TileData{readonly exists:boolean;readonly fixed:boolean;readonly color:Color;constructor(exists:boolean,fixed:boolean,color:Color);/**
 * Create a gray tile.
 */static empty():TileData;/**
 * Create a non-existent tile.
 */static doesNotExist():TileData;copyWith({exists,fixed,color,}:{exists?:boolean;fixed?:boolean;color?:Color;}):this;withExists(exists:boolean):this;withFixed(fixed:boolean):this;withColor(color:Color):this;get isFixed():boolean;static create(char:string):TileData;}export class TileConnections{[y:number]:{[x:number]:boolean;};constructor();get topLeft():boolean;set topLeft(value:boolean);get top():boolean;set top(value:boolean);get topRight():boolean;set topRight(value:boolean);get left():boolean;set left(value:boolean);get center():boolean;set center(value:boolean);get right():boolean;set right(value:boolean);get bottomLeft():boolean;set bottomLeft(value:boolean);get bottom():boolean;set bottom(value:boolean);get bottomRight():boolean;set bottomRight(value:boolean);}export abstract class Instruction{abstract get id():string;abstract get explanation():string;get configs():readonly AnyConfig[]|null;abstract createExampleGrid():GridData;abstract copyWith(props:Record<string,unknown>):this;/**
 * Indicates that validation by logic is not available and the solution must be used for validation
 */get validateWithSolution():boolean;/**
 * Check if this instruction is equal to another instruction by comparing their IDs and configs.
 *
 * @param other The other instruction to compare to.
 * @returns Whether the two instructions are equal.
 */
equals(other:Instruction):boolean;}}export{};