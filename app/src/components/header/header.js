import "./header.css";
import "./kds-styles.css";

function Header(props) {
  return (
    <div class="KrogerHeaderContainer">
      <div class="KrogerHeader">
        <div class="KrogerHeader-Item KrogerHeader-Logo">
          <div class="dpr Header.AmpHocEsperanto">
            <div class="Page-header bg-default-50">
              <div class="KrogerHeader-Logo--inner">
                <a href="/" class="kds-Link kds-Link--inherit">
                  <img
                    class="Image"
                    alt="Kroger logo"
                    src="https://upload.wikimedia.org/wikipedia/commons/9/92/Kroger_Logo_11-6-19.svg"
                  />
                </a>
              </div>
            </div>
          </div>
          <h2 class="appName">Super Share</h2> 
        </div>
      </div>
    </div>
  );
}

export { Header };
