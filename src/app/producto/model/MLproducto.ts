export class MLproducto {
    id: number;
    nombre: string;
    materialidad: string;

    constructor(obj:any) {
        this.id = obj && obj.id || null;
        this.nombre = obj && obj.nombre || null;
        this.materialidad = obj && obj.materialidad || null;
    }
}