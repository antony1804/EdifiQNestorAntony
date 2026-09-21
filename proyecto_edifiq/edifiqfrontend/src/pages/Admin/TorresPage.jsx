import CatalogoPage from "./CatalogoPage";
import { torresApi } from "../../api";

export default function TorresPage() {
	return (
		<CatalogoPage
			title="Torres"
			subtitle="Administra las torres del conjunto."
			api={torresApi}
			fields={[{ name: "nombreTorre", label: "Nombre de la torre", type: "letters", maxLength: 20 }]}
			createFields={[
				{ name: "pisos", label: "Cantidad de pisos", type: "number", min: 1, defaultValue: 4 },
				{ name: "apartamentosPorPiso", label: "Apartamentos por piso", type: "number", min: 1, defaultValue: 5 },
			]}
		/>
	);
}
