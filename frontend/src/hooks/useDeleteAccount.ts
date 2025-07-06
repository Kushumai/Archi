export const useDeleteAccount = () => {
  const handleDeleteAccount = async () => {
    if (!window.confirm("⚠️ Cette action est irréversible. Supprimer votre compte et toutes vos données ?")) return;
    try {
      const res = await fetch("/api/v1/me", {
        method: "DELETE",
        credentials: "include",
      });
      if (res.status === 204) {
        window.location.href = "/login";
      } else {
        alert("Erreur lors de la suppression du compte.");
      }
    } catch (err) {
      alert("Erreur réseau lors de la suppression du compte.");
      console.error(err);
    }
  };

  return { handleDeleteAccount };
};