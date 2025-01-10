import { memo, useEffect, useMemo, useState } from 'react';
import PuzzleCard, { getPuzzleType } from './PuzzleCard';
import { Puzzle } from '@logic-pad/core/data/puzzle';
import { Serializer } from '@logic-pad/core/data/serializer/allSerializers';
import { Compressor } from '@logic-pad/core/data/serializer/compressor/allCompressors';

const serialized: string[] = [
  // Barricaded - Lysine - 5/10 - Underclued
  'dfl_bYzNSgQxEITfpc99mARFDOTg7NWTCjku-VttNiSSzZANju8uo0xmhK3T11VdNRy_oFAJHgSMOmey2nkHCO-ZHAhg_Mr4_Ma4ULFrrBvHHauNjemszN6v1WzVatSOjem8aJ03Zk3qGFVdNR-YmF-DL8VnvMoBmxzw75RPovuP2OTdDZ8xbJKvwbgFHJt8uOH_FvrS4X-BsR7ML1N0PtsweYfCphi9LUcdAtoUUpZO5zMgODqdyE6hNBD3CIHiGQQAgp7KR8og4LldKPrl1V9sps9CKS4v3z8%3D',
  // Movement - Lysine - 9/10 - Pattern
  'dfl_HcqxDoIwFEbhd_nnppEYBjteV13U5I6EQtFGaAlcRGJ9d1On8w1nV30gXnoHg3N8ucEFgcJ98i0MivK9T7eiNMSkmUkTs17typRJOnddLRP_ScTaWpuOhUnXdGniMPZOXDXWIm4KCgqt7zrfLL1sMAeF3ocnDKBQL_KIEwxO2-yDy6ubm8mP4mPIy_cH',
  // The inclusion - /AZURE - 7/10 - Pattern
  'dfl_hZHBTsMwEER_Bc3ZMuSE4htG_EApWolLVacutTBJlDpaqoZ_R85GaQpI7GGkfVrPaNd3mzNSSNHDYH3wN6GuYn8MTQ2Fty7sYFCUn0U5rIvSWLKk2TFrx441EWVC0o2caISkeUaWpDQzs4glsvp3TeOW9GSRTXJO7iQ7kxnRBU3RIuwc_2XP7H7Yy8MrezcjWiD3v31efLGj3EFynMh0myWygqyYjpLb4bEww_OwqpqPNvrkN-02Jd_VCgq7sN-Hqo_pBHOvEEP9DgMobPt0aDoY3D68vqye8qg_Vl1oU_5OA3x9Aw%3D%3D',
  // ascension to heaven - /AZURE - 7/10 - Pattern
  'dfl_pcq9CsIwGEbhWynvHNC6WLIZ8QaqIriUNE1tMCYl_eoPxnuXtpPgIHiWZznz4gkyZDU4ZKe064x3Cfmk0fKqHRhOwVTgyO6LNO4yfhi7lf9Z_qb4rvhUTIpRISbjOuVxG3PlL63VpItWEungGBgqU9dG9ZYe4EsGa9wZHGCQPTU-gGO2Ou7zzbDqTgXTkvFuWF5v',
  // Racing into the Night - Lysine - 9/10 - Music
  'dfl_1VjdbpswFH6VyJV65VWY2ASouGjTpppU7aKtNO2qwpSmVqmZwHSpxh5kL9GH2pNMQEkcY0OaNVXHBZyDzznfdz7_JMK6_gkEE0kMfHARRozPR4yLdCTu4tEXNr8TAIJ5xm6AD5A9WSC3vEL2xD94s-vrNlE__uGibxTzf-FTo_MKClvToqtUKjtyVboeTjWAby0L3ajqMOpmEVQyZOTOfS1YvptwXjmfVK95x5X8PnTdEFUsNYB2HrpVQdejTQyoCrfZOtkmqu1G108LraqoiKdKaYpRpaNmHaQ9RTvovU3RPhG6k963H3d5ZipsOjpQ1dkZh_UNqvJrjN0RWPbfC7HrmXgvjA-DXU6RX15GRS7Sh2sRLwRcBBMMnwIL3sR5lLHvgqU8gNUfpYAs8P4esvHhFdnfI-4h11xNwBTVAY1z2TwuYFU_-PP7GWapCOu6lr8OjZD9ftjlxUORswhGKRdZmpwzHudBZDUZ1HZerLx5ZI98fw_jw0frwOGn1Fk5J5I9lexjSlbOkeycSfaMyGUl50Syp0Qui-WyknMm2TMsl5WcE8me4lqqyH7pGXlEadb0qLKwqtRGWagVmNivSkNbcUR2H8k6YtwWHpsiOo2qS6INdPo41hHuEB17PFTDJoM13C7N6n3boLn2eFAubA3JhdFgjVbQsX1gIIL1TdZDrYbLBaT2ScbGZIK1EtRDZkgyCOmYIR0zpGOGnHS2iQo50etcD-k3dD1kJjrB6lycOtqtdfxyGvEjoh0_1b8-xm0a1qd1XtesOitkefiq9emSFzUQM7xfHqmr87STqSfnaQ-zasjVb7Z6yDxzLh6adtczJntmSM8M6Q1CemZIZJkxkWUGRdYgKrJ6YFEPLOqBbX8PPtYaR-2P0Idc5Ai1x9T6md-MOYPzaDuadCiyMLoP_Ns0i_PqaxyM0oKLgMAsnsf8Mxdx9hgmwdiCuQgzMSuSJLAABDfs9pZFRSKegO9BkDB-D3wAIAgLcZdmwAfnTznjcRW6-hcJfDCLQ1FkjM_9UVlqPwiOPo2-pWGeUlaW4Ndf',
  // The Hidden Season - Lysine - 5/10 - Music
  'dfl_3ZZNj5swEIb_iuVIOUQ0wgkkCJRDGm22h11V2qBeV3xlsRbsCMxuotL_XvkjwRBT9VapKBIz73jw-GHsYL_-hAyzIoM-DPMMfMNpmhFwyKKaEmjBtwqn0IdofV63IVr7n-KKxe9mf8YDJe5CI8anPjjuRWPDqHaH_PbQvpRNjRMroYRVtHjCJKs3iT2doIUTxAtbWSd1rz7s-YrsJqvpxHEC4Xx1O3ur2Y8TzdnrzoNm73jA9YJkoaZ07NtUREacYTG3yFpF0F3EG81B9mgSQuNZy9HykDMecg1zWayKkvcNf_1SC9FaDP9HfSCL2CFRg3QO8iZbQ7wrvT2mkxUKeIssvUDjdfVOmq21C5f0ltH97cAXraML-6HwMPB3qr8EW1Ggx_Fe6wg9aQ8pK7hDpiac3cM4KvWwTjx05hWbqq-PjosavnuEQ4wjKE04TUiNWI1oTXjvECtBYVaLcc9Ov9ZQS3e9gBiufsIVaQ_rAK0J7yhiA-YbarQwqCeDppC7_ciNumPWtyP6o9OrWUOoivWTpma0tNKsTip8YpiSzewlv7C8BCWuy4gludikM7CnSVMDSgDLM3DCLMkt_q-ycc_qCAvlqRrP43ls2uByqlecUCL2zVnsGSTsi7BtYWu1CHULZjJ1BnguqC9lTAsxlBcw7bWD3gp_bIO_2lViElnwCgXP6TNvg-_Ho9AryqJbkbY8fY1LXP43SxQZ0IIpPh5x0hTsAn3XggUm79CH0IJRw3JaQR8-XWpMMj60Wyr04T6LWFNh8uaDtuUfKnvaVOozpQZfwJYwSjAFP_BHVKS4beGv3w%3D%3D',
  // That's Why I Gave Up on Music Grid - Lysine - 9/10 - Music
  'dfl_tVVRb9owEP4r0SGxFy-Lg8OCUR4YXdGk7qVlQpUmVXGSFguwkeMU0LL_PgUSYqha_MBOiu9z7vN9zp2TeE9_QHO9zIDCdB7rT7kzm--cH84kfs2cX2tHCudnkfPEmSieAoKXylHAwRb75RQH1HXdmVsN-9GdnZp7ahu2aYzVlzl_Y-zoDnR2vMmakTXYWNDmZoydrthbOcYebfY0GpUPaaw02kYe2kUYiWLFMhX5SCqeCR1rLkWUyo2gNQ2bNPwuzbfL1rPLRuyyBXa0vp3oVztaaCc6sCyvbRuwJc-yEbhnybvUiqTItVw96Wzb9NdDaZYniq_3JFS9RJG39bod7JPh1Ot2gnB4mIyxMXk4uHtUpYrwFx8pWQt5ZyrhtVR6H6kM_o9Keb-qvjEokUIrubzjIsujpE7JfFKjde3Vq-h2CBmeOc_ti5t-i8cG_ha0eGTgiYFvDfzdwDdHTMQ42D9S4l_YCbky8sVBt1fXhIRmLaoIOa_WMRLWEdw_j-A3JW5D-GKtr4uIQFrFySICBCl_fuZJsdQ7oAMESy4WQAEQxIWeSwUU7nY5F1lFbc8iULjNYl0oLl6oU5Yf_88-O49SFfmcL-Ky_C3g7z8%3D',
  // Rotated pathway - /AZURE - 4/10 - Logic
  'dfl_pVBtS8MwEP4rcoN9CmhlhZDRD274B7rJwC8labP1MCYlvZoW63-XtEXBD6Ls4F6fh-eOuyvegZCMBgG5I0m6umkk1UEOwODisQIBvOfjkQsVlFJhp2KMHpYixl2sInaaBqefePRxn4jxMOZK2qKRRNpbtuQs7dP1KrnfbI_pepXyrf2yEEL47uzM2icTa24Oc8rF_4SVsvaPwqWzVpdUSGNY6YzzmcFLTeJ1aEn7gbXOdITOZrznyzY-6Vz7sl-OYm_YojI6S4BBheczlp2hAcSGgUH7AgKAgeyodh4E3D48P-WPkarb0mMTz42Uj08%3D',
  // wacky clued - /AZURE - 4/10 - Underclued
  'dfl_RY_NasNADIRfpSiQ00LrEuOi4EMS-gJOeunFbHY3jvCiDZs1yo_77sU_tIOY0Yjvorf6CYmSd4Ag2rT3F-M7Z0FBE8kCQnEr-kOBInIU2cp2ztnHYRFmGbdBk_e7DPt9X5nA7EyqtffKBB9i6ak5J4yuocC1jk7Pd6tjq670cGWGR831RafkIqs5y_yWLxfZ-2p9yJeL_GPNf5JB_3WidtlITWU_RYUdWxfHFxUosHQ6kel8ugOuFHjiFhBAge7SOURAeN18f1WfA-quJtIlUeAB-fkF',
  // Hi! - /AZURE - 4/10 - Logic
  'dfl_jdJfa8IwEADwz7J7PpjpH5VAHsYY7NltCHuRpo01mCYlTWnLuu8-qnRWrdqHkMvdDxLuMtv8gJNOCaDwLp8AIbUyAQqE1Iv2kxDKebXmFV9zzg_bYVXDsAP8H1QHXw1DXh1DzttXQtsPZVxZYM1m2DAfjZVCu8hJo5kSW0f7MrmuW5nuTiC8qpc51WXGhcWaedgwD49H5p3ng1M-iazDmvnYsFmfDUcuHTjSu7HHDZw30fm9m993p1ffd-FEN-9dcNsthn0Jroc1YGQa86Yxf3wYlywY7_ElC6ex-WO2PPtWtxu3fDCwdlU0GTeq2OTCbqxIpdEYm1I7RjA2yliWRHaPscnyyMrCaJYKQEjkdivjUrkGaICgpN4DBUCISrczFig8v3x_rd46KorYyry7syO_fw%3D%3D',
  // The start of balance - romain22222 - 2/10 - Logic
  'dfl_ZY_BagMhGIRfReYsSxK6lx9y0L5BG8gxqOvGnxgNrost2bx78dJL5jvMwMxldpcnKtfoQTgFL5ZqShV5FtZEk5yHxLXwBML487GdRjpbe9a2Wds63VvbPkcalBoGpZXSne5ab9_bl_MxXlxeU5Uux1yOka-h5zXV435Hb_1kyu2_hsTE88xujfUXdJCInG4gQMKsNeQCQsl3w-nQ1fd-cYUflXMCQYkl5ObM4vspIybvH-LuXTCJHV5_',
  // We are not the same - romain22222 - 8/10 - Logic
  'dfl_RZDdSsNAEIVfJYzgRVmKWoWwkhuLL6CBXobZzdQu3Z8wmTCK8d1lq9C5-M7N4eMwd8M3SJBIYOFADTI1uUgjJ2pmTAQGPjiMYKH93K19a1UPzjmn-gd9caoV6_7eru_rm19mKcmMNHsOk4SSu32JS8pz4zFX9YZpIpSNqeKuf7y9eWqfr05X6azDPEwoQpzNf3b97tLd6lZVrS85k5cBYzS-xMLdiHwGA2M4HoNfonyBbQ3EkM9gAQzgIqfCYIFLwpAf6tX-dStYeE2O0dPlA9VETNnTDD-_',
  // Polyomino's - hallojasper - 7/10 - Logic
  'dfl_fZBBbsIwEEXvMkh0M4vEhFIZecUFKmAf2YkhBmOnE0chbXr3yoRIVCqVxvM9X09_ZCf5FwQTrAYO7972_mKcf2kA4UimBA6r6-uwX_FOqW48sVSnlLq1aYr-7a6GTcqHXSkp4FUssRcMXXtRmkSCnox2QQbjnWhr_gAt_oZK37kJy7AXywlLn2Qx7EUyQewXROZYhYlLHsMWz7mYl_2TN2wL75wuQi6txcJbT6KUdOakj8a7XJKWd9tGHhvzqUXGlXR5LUPQ5PCugl3ZfJaybL1n89nybR3_eDQ26c0Yh90oW94689HqvKlkrR93AEJpDgdTtDb0wFcI1rgzcAAE2YbKE3CopLX-JJtaU-R1U5Cp47si9_0D',
  // Galaxies - mincho - 6/10 - Logic
  'dfl_fc8xa8MwEAXg__LmG-wYp_HBLe3Qve0eVFtxjihSkWWwWve_BxNCKTh5072Pt1yx_0HS5CwYr8aZSe0AQh-1A6OZmvmjYf84z_ePO5lfSp7f_Xj-tJEmKSjLhq5VKv7n2xUvKctuxZ8eeLniO8pS3Lzmfvk_0yQVZan-ak1Z6vkt2l6D35toDbXBhSidiSca9NtKBUKnh4O2o0sZvCU49ScwQDBjOoYIxll9ewzL1A5t1K-kwS-T3ws%3D',
  // Snake - hallojasper - 4/10 - Logic
  'dfl_fY3BqsIwEEX_5QqugjhaQSJu9A-s4LIkadTYMCkxQsX676Itj7covZvLHC5n5sULySVvIZGzqiwELtGVkCBqiNojkeS_7HgspwG0G4Kjln8_2j3JNm8PJjBbkwrlvTDBh7gtVaykVlzUKiUbWfS9XTaL6YQW2ea4nE5W643Ws5nWHdrTD3VH3tVh0JI11Fuy3jLqgEDpzmdnHj49ITMB77iCBATUI11DhMRVeR9u6l7b-N3bu4muTi7wd_f-AA%3D%3D',
  // Abusing the limits - romain22222 - 3/10 - Logic
  'dfl_rY7LTsMwEEV_pZq1VdlJqsJIXhT-AJBYIrd10lEdu3ImkIjw7yiQV9nAgju7c-baI1_egYmdBYTdvq7IFys-2ZWjkrgCAUWkIyAo2SjZPSmJfj3NnF_Z85_27gbU3SuJuynraf6bdY-vZN8ugTyLRkvRail8Xe5t1AqXKhGtVqPa4s_WzaiSK7VdtlJ0getKNDr7wiGS9WyYgtfO5oyFcaZpB7_B79rw9-181sQ3VzybhRKtTkex4P272XSp6h5AwJHynA614xYwFeDInwEBBJiaTyECQgylIZ_06fdtdYh06a_u9z4-AQ%3D%3D',
  // another view - /AZURE - 5/10 - Logic
  'dfl_rY_RSsMwFIZfRc5gVwds2maOjFzI8AW6ieDNSNrMhcWkxNQ2WN9dauec0Itd-MPh5PD9_yEn2X1A0MEoYCCsCwflb961agHhxesKGJCkI0m_JQl7-pU96b9eZ_VrwvrN8IPaaRuw4wQjX6JtXqXyPGOXKMfI734Q_YMyjHwxnUoxcjqdohh5Pp1aYOTZdGpA6Rn1hRR2V4sQlLd46px2dD4jab7a0vmMLlfj4XIoKe2FRteafLvGYTO2gl2_uB1KttcuLp21qgw7YQyWzjjPK-GPgFDp_V6XjQkRGEUw2h6BASCIJhycBwa398-PxcNgVW-l13XQzg6Wzy8%3D',
  // One of each - hallojasper - 6/10 - Logic
  'dfl_bZHBjpswEIZfBTlSDquphBPCskY-ZPcBVkr20Bsy4CTuGoyMKVhN372yTZKlrSWjmd_fMP9o4uIXMsJIjgh6b3mkThFn1QUBOmtRI4JwPOH4-oFjUpblOIbrvuN8Z3H0-hKY4xm4P_ybhDOO5fUNk-uxHZqSa5goBks3EFL6TBY6fuiNVZ1gMNEtWBpDLTSvjFBtTyWRygw9TPQFLH0BpQVvDXOPdOjujxlYmv31-E3ykyE10wYmmoKl6a3hdkFqcb4YcmaSTRYmunEk-Sn42CnRutpnsHR7q02I5Mb4ITI_REjpfqmnN_31euhZw4v-wjoOlZJKU-k79rYpleyLjutC87NQLVRqaA3FC6waeqMaqHlfadF5x3sTNao3EY7CP6KO66hm-jNimjNwi6e7KVmv8CbJP3br1S7Lx7DhsPCw7jEAb9gDITmGdoXhk1mvkiSf1qsU59jH9kv8xY9X99FTKH2KXO3szKPOj2e8p22W3325eJfl7X_OA3T-ZvAhHh_hwTcJhlOcf_epVmG7XorDbAcEqBank6gGaSwiKSAp2k9EEALEBnNRGhF0YVKqH6zvuHb8Y0zH_f4D',
  // Front page - /AZURE - 2/10 - Logic
  'dfl_jYzRSgMxEEV_RW6hTyG2xYCk9CFb9AO2FcGXJZum22CYLHHKVlz_XeIqiE8dmHuZ4XAWzQc4cPTQeMyJ-Ka3nYdAl8MBGuqixr3Skv5NRc_lJ8et0lIaY6Q0VVVi3I11a6npLbPPJH56oy5qPluu7tZ7NZ-p-_XkGcoOw1_1RG2X39R07Kaq9fXitv2Nq8QuEXnHjY1RuBRT3sTQnRgCh3A8BneO_A69EoiBXqEBAXvmU8rQuDUvT_VDQf2by6HnkKggn18%3D',
  // a short sticky situation - /AZURE - 5/10 - Logic
  'dfl_jZDNTsMwEIRfJZrzqsSkFbCSDwjxAi1cuEQmdZNVXbuyHamG8O6Iv5QTYk-z38xcpm5fkSU7C4apqjSEmKuUpduXKkkeTZbgQeijbMFQ9el6elA1--9b-H-qxd9qulM8bfx4eLaRTvqKiq7p69WKZ95Q0eqHN2e-oqKXc_7ybNxQ0c1cmNbJHGybBnO01AUXonbSD5mj7SX41kRrfnNK8mJ1A8JWdjvpRpcLeEVw4vdggGDGPIQIxsXt0-P6_iNqUxfl-DkcA2_v',
  // i hate sweeping - /AZURE - 3/10 - Underclued
  'dfl_bczNCsIwEATgV5E5B7StvSz0IOILVCXgRWy76mKNJU2IYn13qaD4N9dvZkbrK5y4mkGQwX7jeNAG5kbMDgo7KxUI6XncLVIKIRQhaK1N0IU2RZ9uGlE3P4rhx4ytOmeRumSRMv5YsM0i-sT4HWP6XcZPHH9h8o7pH3zdJl3uTcW2rD1XCgqVbLdS-tpdQIlCLeYAAhQ23u1PFoThZLXMZ32V29JK4-Rk-srtDg%3D%3D',
  // Surrounded - Lysine - 6/10 - Underclued
  'dfl_bZDBasMwEET_Zc97sN00DgIdSq89NQEdQ2UrragyLoqEIur-e5ECcUMz7B7mzSwCNftvCjY4Q4K20fspYjQjMb17O5Kgtjm3zbxrGwEAqQjQZbVG0kpppKR0QrHQQAKgoRWqVHX_VGNV5yadn1sxb50JwXg-y46z7Phi5ZO48p6z7BeOeNSVt7V_sbJrlqD_G2wWvuYsV9eDhT9wlo93eHlgc4evbvj8Wj7RDy6akYlptIeDHaILmcSayVl8kiBieovhY_Ik6CWfLEypmtPg7VewE0rl5xc%3D',
  // Spiking trail - /AZURE - 10/10 - Logic
  'dfl_lYzBasNADER_pSiQ00Jj04JRyKEb-gN2iqAXs107jvCiNVsFEuL8e3DdNtdWIN7MMMyqvoCyhhYQqoF7lu5Bk-MABrrEDSAUp2LcFSi_R0IT7PQkdzMrIXsv_kgrNG4zHKux_HBSD061TWK-uclP-XKR5U_rXb5cPBdra62dg232FcymmlGijyKt19qFYHwMMW0al3r8yzQR0f-mA3cHBQMN7_fsj0HPgNnKQGDpAQEMuKMeYgKEx5f3t_J16rafPvGgHGWqXG8%3D',
  // Pentomino's - hallojasper - 9/10 - Logic
  'dfl_TY_dbsMgDIXfxZW6G4QWtEobVS8gLzC1vY8gpQ0tg4wQpduyd5_46VrLwubz8UE8Nz8QdDAKKLwrG9yHtu5pAAQnrw9AoSLXisz7ilCZYpJymiaZMh4y9fdIXOLISmblTZgz6crCJLPlv--DV_Er29P9DSnlXFeEYswY5xgzjjFmmGPGMOMs9RGVOYu8kDIp47SQa2x4LCWyJb7JkiA5Y15nhlnNeZ1g7Bmbd_O2ddaqNjTCGNQ64_zmIPyFenXSzjbCK1Gw0acuoEF_q82KSmGbXoSgvEWlbsiVLBcVeVnvyXKxel3Hv2dQVwnkyy6XLR2t_hxVM3SiV49vAIKDPh51O5rwBfQNgdH2AhQAgRhD5zxQ6IQx7iyGXvmoV0PrdR-0s1H3-wc%3D',
  // Matrix - Lysine - 6/10 - Pattern
  'dfl_NcoxC8IwFATg_3JzCLoIzfhcdVHhRmlr1Ie1LemTKNb_LhG86e74Fsc3TK2LCNjWlvQJh0vSEwKqZzUfqkARiogXIUv3v02hJ8lM0lMoOYv8HmlywUXkxtP_wyyNkN7P62WY9_OuHe5jFy0ex9ospt7B4aTns7aPzl4IK4dO-xsC4FA_7DokBGxek_ax0Di1SUfToS_k8wU%3D',
  // Chain reaction - /AZURE - 5/10 - Logic
  'dfl_rZFBbsIwEEWvUn0kVqPWhpiAkRco6gUC3XSDQjDFajDIdUSipnevIJAEKUtmMzNPX28xw9a_8MZnGhLRPjH2xekk9eZoQfhyZgsJzgrOqhVn8tXeqhmeVa25irisljY_bLSjQoVUqhnVqxrLhgddPm05o1KFdz555KM7D1rOqVSsx3Pxj3t42PWIls-6-eAxP2k8VbxJ7PqUeK-dpVtXohDDAR8F85UYDsR03nuh89naOhXxa6pelnWLQdia3c6keeZLSEHIjP2GBAhJ7vdHB4m3xedH_H6J6p_UmdP1zxL4-wc%3D',
  // Witnessing every vertex - /AZURE - 6/10 - Logic
  'dfl_nVFRa8JADP4rJYJPR7db1zFOfLCyP1Adhb2U6_XUwyNXrtFW1v330VZEYTC3hCQk38eXQB7zTyBDVoOAzBDquja4DfRR-1Nw1J50Cwy23pQggEctj7o1j0R4bQleLAlDzC4ehsMwG_JPCP4D-U0tubmtW3LRrbpUOUStKJfWMuWs8_NS-r0oJOaVJNIe2bnO4zaeTvjT82wdTyfx6-ysW_RRFFebRtaSD6yxWY0l_YNw00fT4H3CwKA0m41RB0snEC8MrME9CAAG8kA750HAw-LjPX3rqbpW3lRkHIKARVBJ2gXkbt_79Q0%3D',
  // Essentially hexagonal - Lysine - 8/10 - Logic
  'dfl_7ZVNT4MwGMe_iqmJp6bhRXCp4VBAvXhS7wtsdTbWskCXjTi_uykMN3lpe9jBgyQ8Dfx_z3sCzvwTSCY5BRjcVRUVkmWc1xdvdJetCpFxAMGqZEuAgR_sfG__4gcYISQMlxWibBxPW2SD6PVDEBNylnbOVMuZ5vK_o1Hkf0d_f0f7xA_VR4aQONbdyI6J4yRJ0-kb2TGEpKm5GiOjMumyIUvmXPWYeifEltHuQjVkyehyqYZM9RwYXe9pap7PgdHtghDzvjrGkKsdoQ2j6b0doi0zuYsOs2SmO-8wM6PpvcN08zlhpnbRYbp9dcz-mVMpaQl3kYMCWEchCmD7KiL4R_PcRnRGxbDvGB8112tEdzaqejf9sMlAbCIMVd_vu6YDV-96VG2K-V3THe6NwXdGxXDg-TAo6TTr_WASp4Hv-4FPxYf9U1V_5AWv5mtazku6YoWAi2IjZOTARcGLMlpm5TvOMzFfZ8pHwMMZhTvv6tL1rm9fwqvLYHa73eb5dtvaVkjcRmgfntvjaSJW2Iulfl6tFXl-tOKoaHIACJbs9ZUtNlzWAM8g4Ey8AwwABNlGvhUlwOCxrpigCqXVomRryQqhkK9v',
  // Shifting Dance - Lysine - 4/10 - Music
  'dfl_1ZbRbpswFIZfxXKkXESsCilhFSgXQJterL0ZmbisDLiJVWI6Y0aisYfaM-zFJh8IMZT0ZurFHCmc8xvHx99vQ-ZPP7FkMqPYweGOPUvGt-iW8IRiA28FS7GDTftg1xvTdiI_iqI4rqqqgi8_8iO_apqSoyjyoyaEFqlWVd0d_Vzrb0fUgWk7V6p5nu97HlwgV5nvw-Vf--uw_rovC5YYSc6lyLMHxmmxSubTibmw3HhhtZH4Mb-yebCcTizLhdi3zrGnxfdavNbiO8uQgiQvK0Ww-dGNaU8nyxsXAGooY_icUbZ6h7LfLshaVzNb0M720Uyb2cLm0tAFCjrh6cQ2XUX5-sbVSJ8y0VFVSkd2MhDWQ-FukN8O8mDSGAJGQA2mffh8nhcMUYky5Q3MjzbpVEWgVfHRZg37z1WE5_BkYouyb6QSNTPfGto3VR2hk6ofpaHmjWj3I9p6RLsb0bSt0LrfFr48WP06N1qFyxuXj7T-gMDsDeh3hv1UR3kR5wjSDqu5GFFfR7S3uC8hv4T9HfQawrZYJykLme-NlBaJYK-S5Xw1-0KPKNkRvqXw5JkhL8sQzyUtEBEUFeodQ1NEOKLfS5Ihss9LLg31qlldK1_Aj-v2sRXHarOq72nHHXgD52b-J5bkHM74Ac73HOIjxAuItQJB9dCsGTpDaiwqjvs4z-BWVce0t0f0_fHu3tD3RbcnhscKJmkKtk33MfWEyKtvrxURKXSJXJKuzjksdnyVC22V5v--ShiEDZyy52eWlJk8YscycMb4C3YwNjAp5S4X2MEPx4Jx9d9EWy128JoSWQrGtw6q65D--Z0LJgn6hMIdqTh6pDylhYECsmcZQQGJaZbldY1__QU%3D',
  // River Flows Beneath You - Lysine - 7/10 - Music
  'dfl_7VjdT9swEP9XIkfqQ5WhfLVDifqQjxZNgkmDvvCEktSARWojx4FWy_53ZCcQ121TSjUNpl5V-e5859-dYt85MW9-A4ZYDoEHLtETpNokJ8-FFkIME3avXZMSGOCOohnwgGMvLKeaOrb33FCaPm-kNF2d2WbXTete71tHtToEfR_fzR77r_MxknGqyLG9IAiCMOz6d88e_f-uf3VVXc7LAmVGRjCjJD9HGBajzOzplu36qT1suEerHumTeTLEE93t6a7rC2Es8bHER7JR6LR8IPFnuiRMZGEs8bEjLysJoS0taxuMJtnDyLEX9qAOd-rYPX1w6m_dsDv2887pVLGUx7RVpOK3Pm7xXMF-_7Fdc917hYMolZLdZnIs1js9_kWxrk9L1JyWkw7idaNrnleVo_9h_l1VO4rCsLvqR9Fn7zpf3b8-LVf1UPdP0YbkHtrTh5bP-6hz6ku99FXi_fSVr3vqeFhr3nqeIke6oggHq3KgyGe6opioirEixwMVUlGErgLpqgiKYqzIsasiKAp-T1hBcNSkHBVSUYwVOXZUSEXB7xArkPWdQtwlxFP0srJgZG7MYJFR9MgQwaN-jApuwYVCFM2-9uMOEwq1ElOYZPdJmkMNEwYLg7-7jOyF3dxJ2iLblF1LKJpdVYPdoIxgEcdCxGAKfinxUjRCG2j92rWvcV-tWM5TkgtTji9sBgu33XbT5uEOTn28gVrDyHozbJVXLXspQOqAh5Z_MftVwoLHdZHQBzFHCUveAjVFtpvTtKQ0rf83TfMrpXnB69tPwuDHH-Wn37HdOQoXYIAZur1FWZmzJfC-GyBH-AF4ABggKdk9ocAD58sCYchN21yBByYwYSVF-M7Tqkr-xoEw_7yhfdOuES3nSVWBPy8%3D',
  // Crossection - /AZURE - 4/10 - Pattern
  'dfl_rZDRasMwDEX_5Rb6ZNi8dRBc-jCH_kDaEdhLqVJ3M3XjYDvzwrJ_H46zQd8nI650EdLB94cvBB2MgkDprPeqCdq2YHhz-gSB4pM_jvtCxNugX6mnkDJLLbP8uXJ2ZT2X2ZUyUn40L6NUU6Sx5GLcjVVjr51RQR26YwjKtUxcBx-UG5i3pk-Mm4S2XPCH1XpfLBdPxfqW7X8YKeacNiXAGCkfLfl0NDe7LBX70F6TURsOhpM-n3XTmzBArBiMbi8QAMOxD-_WQeDu-fWl2qZR5Runu-nvBfD9Aw%3D%3D',
  // All rectangles - LaggyDev - 5/10 - Logic
  'dfl_lZFda8IwFIb_yjiCVwdp1NQayYV1l7tSoZfSauzCsig12oZ1_33UWhNwQ3YukpynD28-Gmy-wEijBDCYK_VSiK1Jda7ECRDyQu6AAQkqEtRrEjD9UHESJ1rrJNZJnMRX8Cjd6vrdSX-Y9WLKBs9rfl_UK33-zESBFSdo-RDbllN25wFaPur42PEhWh52PHR8hJZPOj5xPPK5lzPxc7x9Q39fj1P_nJHjU7Sc_JIf-X7I8lSllcWKj9HyyLWNNhpQB5r3IOwiRXk8SG1uL-FuXC-zVG-OqTGi0HibOa1ov0eG49ma9ns0mrl_k2XNUHZtay3I1WqbVTst2f-Cy7IbngUDwk7u93J7VsYCowhK6g9gAAjp2bwfCmDwlua5fRWXRhanbSGPRh50I33_AA%3D%3D',
];

const curatedPuzzles: { data: string; puzzle: Puzzle }[] = [];

export interface CuratedPuzzlesProps {
  filter?: string;
}

// eslint-disable-next-line react/prop-types
export default memo(function CuratedPuzzles({ filter }: CuratedPuzzlesProps) {
  filter = filter ?? 'All';
  const [puzzles, setPuzzles] = useState<typeof curatedPuzzles>(curatedPuzzles);
  useEffect(() => {
    void (async () => {
      while (serialized.length > 0) {
        const data = serialized.pop();
        if (!data) break;
        const decompresed = await Compressor.decompress(
          decodeURIComponent(data)
        );
        const puzzle = Serializer.parsePuzzle(decompresed);
        curatedPuzzles.push({ puzzle, data: decodeURIComponent(data) });
        setPuzzles([
          ...curatedPuzzles.sort(
            (a, b) => a.puzzle.difficulty - b.puzzle.difficulty
          ),
        ]);
      }
    })();
  }, []);
  const filteredPuzzles = useMemo(() => {
    return puzzles.filter(({ puzzle }) =>
      filter === 'All' ? true : getPuzzleType(puzzle.grid) === filter
    );
  }, [puzzles, filter]);
  return filteredPuzzles.map(({ puzzle, data }) => (
    <PuzzleCard
      className="min-w-64 transition-all hover:scale-105 hover:rotate-3 hover:shadow-xl"
      key={puzzle.title}
      grid={puzzle.grid}
      metadata={puzzle}
      data={data}
    />
  ));
});
