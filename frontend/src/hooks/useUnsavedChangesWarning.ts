import { useEffect } from "react";

export const useUnsavedChangesWarning = (shouldWarn: boolean) => {
	useEffect(() => {
		const handleBeforeUnload = (e: BeforeUnloadEvent) => {
			if (shouldWarn) {
				e.preventDefault();
				e.returnValue = ""; // Wymagane przez niektóre przeglądarki
				return "";
			}
		};

		window.addEventListener("beforeunload", handleBeforeUnload);
		return () => {
			window.removeEventListener("beforeunload", handleBeforeUnload);
		};
	}, [shouldWarn]);
};
