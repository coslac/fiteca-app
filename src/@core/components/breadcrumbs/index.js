// ** React Imports
import {Link} from "react-router-dom";

// ** Third Party Components
import Proptypes from "prop-types";

// ** Reactstrap Imports
import {Breadcrumb, BreadcrumbItem} from "reactstrap";

import {useTranslation} from "react-i18next";

const BreadCrumbs = (props) => {
  // ** Props
  const {
    breadCrumbTitle,
    breadCrumbParent,
    breadCrumbParent2,
    breadCrumbParent3,
    breadCrumbActive,
    noPadding
  } = props;

  const { t } = useTranslation();
  return (
    <div className={noPadding ? ` ` : `content-header row`}>
      <div className="content-header-left col-md-9 col-12 mb-2">
        <div className="row breadcrumbs-top  d-flex">
          <div className="col-12 breadcrump-container">
            {breadCrumbTitle ? (
              <h2 className="content-header-title float-start mb-0">
                {breadCrumbTitle}
              </h2>
            ) : (
              ""
            )}
            <div className="breadcrumb-wrapper vs-breadcrumbs d-sm-block d-none col-12">
              <Breadcrumb>
                <BreadcrumbItem tag="li" className="text-secondary">
                  <Link to="/">{t("Manage")}</Link>
                </BreadcrumbItem>
                <BreadcrumbItem tag="li" className="text-secondary">
                  {breadCrumbParent}
                </BreadcrumbItem>
                {breadCrumbParent2 ? (
                  <BreadcrumbItem tag="li" className="text-secondary">
                    {breadCrumbParent2}
                  </BreadcrumbItem>
                ) : (
                  ""
                )}
                {breadCrumbParent3 ? (
                  <BreadcrumbItem tag="li" className="text-secondary">
                    {breadCrumbParent3}
                  </BreadcrumbItem>
                ) : (
                  ""
                )}
                <BreadcrumbItem tag="li" active className="text-secondary">
                  {breadCrumbActive}
                </BreadcrumbItem>
              </Breadcrumb>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default BreadCrumbs;

// ** PropTypes
BreadCrumbs.propTypes = {
  breadCrumbTitle: Proptypes.string.isRequired,
  breadCrumbActive: Proptypes.string.isRequired,
};
