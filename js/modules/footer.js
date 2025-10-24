export const getFooter = () => {
  const currentYear = new Date().getFullYear();
  return `
    <footer class="site-footer">
      <p>&copy; ${currentYear} Faktos.</p>
    </footer>
  `;
};